"use server";
import { db } from ".";
import { unstable_cache, unstable_expireTag as expireTag } from "next/cache";
import { libraries, Library, userPlaylists } from "./schema";
import { and, eq, sql } from "drizzle-orm";
import { Album, Artist, LibraryItem, Playlist, } from "@/types";
import { getHref, getImageSource } from "@/lib/utils";

export const getUserPlaylists = unstable_cache(
  async (userId: string) => {
    const playlists = await db.query.userPlaylists.findMany({
      where: (playlist, { eq }) => eq(playlist.userId, userId),
      orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
    });

    return playlists;
  },
  ["user_playlists"],
  { tags: ["user_playlists"], }
);

export const getUserLibrary = unstable_cache(
  async (userId: string) => {
    const library = await db.query.libraries.findFirst({
      where: (fields, { eq }) => eq(fields.userId, userId),
    });
    return library;
  },
  ["user-library"],
  { tags: ["user-library"] }
);

export const getUserPlaylistDetails = async (userPlaylistId: string) => {
  const playlist = await db.query.userPlaylists.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, userPlaylistId);
    },
  });
  return playlist;
};

export const removePlaylist = async (userId: string, playlistId: string) => {
  const [deletedPlaylist] = await db.delete(userPlaylists).where(
    and(eq(userPlaylists.id, playlistId), eq(userPlaylists.userId, userId))
  ).returning();

  if (deletedPlaylist) expireTag("user_playlists");
  return deletedPlaylist;
};

export const addSongsToPlaylist = async (
  userPlaylistId: string,
  songs: string[]
) => {
  const playlist = await getUserPlaylistDetails(userPlaylistId);

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  const dedupSongs = [...new Set([...songs, ...playlist.songs])];

  const [updatedPlaylist] = await db
    .update(userPlaylists)
    .set({ songs: dedupSongs, updatedAt: new Date() })
    .where(eq(userPlaylists.id, userPlaylistId))
    .returning();

  expireTag("user_playlists");

  return updatedPlaylist;
};
export const removeSongFromPlaylist = async (
  userPlaylistId: string,
  songId: string
) => {
  const playlist = await getUserPlaylistDetails(userPlaylistId);

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  const filteredSongs = playlist?.songs?.filter(id => songId !== id) || [];

  const [updatedPlaylist] = await db
    .update(userPlaylists)
    .set({ songs: filteredSongs, updatedAt: new Date() })
    .where(eq(userPlaylists.id, userPlaylistId))
    .returning();

  expireTag("user_playlists");

  return updatedPlaylist;
};


export const addToLibrary = async (
  userId: string,
  token: string,
  type: "song" | "playlist" | "album" | "artist",
  data?: Album | Playlist | Artist
) => {
  const library = await getUserLibrary(userId);
  let transformedData: LibraryItem | null = null;
  if (data) {

    transformedData = {
      id: data.id,
      name: data.name,
      totalNumberOfSongs: "songs" in data ? data.songs?.length : 0,
      url: getHref("url" in data ? data?.url : "urls" in data ? data.urls.overview! : "", data.type),
      type: data.type,
      imageSrc: getImageSource(data.image, "medium")
    };

  }
  if (!library) {
    const newLibrary = await db
      .insert(libraries).values({
        userId,
        songs: type === "song" ? [token] : [],
        playlists: type === "playlist" && transformedData ? [transformedData] : undefined,
        albums: type === "album" && transformedData ? [transformedData] : undefined,
        artists: type === "artist" && transformedData ? [transformedData] : undefined
      })
      .returning();

    if (!newLibrary) {
      throw new Error(`Failed to add ${type} to library`);
    }

    expireTag("user-library");
    return newLibrary;
  } else {
    const updatedLibrary = await db
      .update(libraries)
      .set({
        songs: type === "song" ? sql`array_append(songs, ${token})` : undefined,
        playlists:
          type === "playlist"
            ? sql`array_append(playlists, ${JSON.stringify(transformedData)})`
            : undefined,
        albums: type === "album" ? sql`array_append(albums, ${JSON.stringify(transformedData)})` : undefined,
        artists: type === "artist" ? sql`array_append(artists, ${JSON.stringify(transformedData)})` : undefined,
      })
      .where(eq(libraries.userId, userId))
      .returning();

    if (!updatedLibrary) {
      throw new Error(`Failed to add ${type} to library`);
    }

    expireTag("user-library");
    return updatedLibrary;
  }
};

export const removeFromLibrary = async (
  userId: string,
  token: string,
  type: "song" | "playlist" | "album" | "artist"
) => {
  const library = await getUserLibrary(userId);

  if (!library) {
    throw new Error("Library not found");
  } else {
    let filteredTypeResult;
    if (type !== "song") {
      [filteredTypeResult] = await db.execute(
        sql`
      SELECT jsonb_agg(filtered_type) as filtered_items 
      FROM jsonb_array_elements(${JSON.stringify(library[(type + "s") as keyof Library])}) AS filtered_type
      WHERE filtered_type->>'id' != ${token}
      `,
      );
    }

    const updatedLibrary = await db
      .update(libraries)
      .set({
        songs: type === "song" ? sql`array_remove(songs, ${token})` : undefined,
        albums: type === "album" ? (filteredTypeResult.filtered_items as LibraryItem[]) || [] : undefined,
        artists: type === "artist" ? (filteredTypeResult.filtered_items as LibraryItem[]) || [] : undefined,
        playlists: type === "playlist" ? (filteredTypeResult.filtered_items as LibraryItem[]) || [] : undefined,
      })
      .where(eq(libraries.userId, userId))
      .returning();

    if (!updatedLibrary) {
      throw new Error(`Failed to remove ${type} from library`);
    }

    expireTag("user-library");
    return updatedLibrary;
  }
};
