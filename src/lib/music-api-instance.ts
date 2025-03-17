"use server";
import type {
  Album,
  AllSearch,
  Artist,
  // AllSearch,
  // Artist,
  // ArtistSongsOrAlbums,
  Category,
  Chart,
  CustomResponse,
  Episode,
  EpisodeDetail,
  // Episode,
  // EpisodeDetail,
  FeaturedPlaylists,
  Label,
  // FooterDetails,
  // Label,
  Lang,
  Lyrics,
  Mix,
  // Lyrics,
  // MegaMenu,
  // Mix,
  Modules,
  Playlist,
  SearchReturnType,
  // Radio,
  // SearchReturnType,
  // Show,
  Song,
  SongObj,
  Sort,
  TopAlbum,
  TopArtists,
  // TopArtists,
  // TopSearch,
  // TopShows,
  Trending,
} from "@/types";
import { cookies } from "next/headers";

const musicApiInstance = async <T>(
  path: string,
  params?: Record<string, string>
): Promise<T> => {
  const cookiesStore = await cookies();
  const languages = cookiesStore.get("language")?.value;
  const queryParams = {
    ...params,
    lang: params && params["lang"] ? params.lang : languages ?? "hindi,english",
  };
  const url = new URL(path, process.env.MUSIC_API_BASE_URL);
  url.search = new URLSearchParams(queryParams).toString();
  const response = await fetch(url, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });
  const data = (await response.json()) as CustomResponse<T>;
  if (!response.ok) throw new Error(data.message);
  return data.data!;
};

/**
 * Fetches the modules data for the homepage.
 *
 * @param lang - The languages to prioritize the data for. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the modules will have lesser data. If false, the modules will have more data.
 * @returns The modules data.
 */
export const getHomeData = async (lang?: Lang[], mini = true) => {
  return await musicApiInstance<Modules>("/modules", {
    lang: lang?.join(",") ?? "",
    mini: String(mini),
  });
};

/**
 * Fetches top albums.
 *
 * @param page - The page number to fetch. Defaults to 1.
 * @param n - The number of albums to fetch per page. Defaults to 50.
 * @param lang - The languages to prioritize the data for. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the albums will have lesser data. If false, the albums will have more data.
 * @returns The top albums.
 */
export const getTopAlbums = async (
  page = 1,
  n = 50,
  lang?: Lang,
  mini = true
) => {
  return await musicApiInstance<TopAlbum>("/get/top-albums", {
    page: String(page),
    n: String(n),
    lang: lang ?? "",
    mini: String(mini),
  });
};

export const getAlbumDetails = async (token: string, mini = true) => {
  return await musicApiInstance<Album>("/album", {
    token,
    mini: String(mini),
  });
};
export const getPlaylistDetails = async (token: string, mini = true) => {
  return await musicApiInstance<Playlist>("/playlist", {
    token,
    mini: String(mini),
    lang: "",
  });
};

/**
 * Fetches albums recommended based on the given album ID.
 *
 * @param id - The album ID.
 * @param lang - The languages to prioritize the data for. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the albums will have lesser data. If false, the albums will have more data.
 * @returns The recommended albums.
 */
export const getAlbumRecommendations = async (
  id: string,
  lang?: Lang[],
  mini = true
) => {
  return await musicApiInstance<Album[]>("/album/recommend", {
    id,
    lang: lang?.join(",") ?? "",
    mini: String(mini),
  });
};

/**
 * Fetches albums from the same year as the given year.
 *
 * @param year - The year.
 * @param lang - The languages to prioritize the data for. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the albums will have lesser data. If false, the albums will have more data.
 * @returns The albums from the same year.
 */
export const getAlbumFromSameYear = async (
  year: number,
  lang?: Lang[],
  mini = true
) => {
  return musicApiInstance<Album[]>("/album/same-year", {
    year: String(year),
    lang: lang?.join(",") ?? "",
    mini: String(mini),
  });
};

/**
 * Fetches trending songs, albums, or playlists.
 *
 * @param type - The type of trending content to fetch. Can be "song", "album", or "playlist".
 * @param lang - The languages to prioritize the data for. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the trending items will have lesser data. If false, the trending items will have more data.
 * @returns The trending content.
 */
export const getTrending = async (
  type: "song" | "album" | "playlist",
  lang?: Lang[],
  mini = true
) => {
  return await musicApiInstance<Trending>("/get/trending", {
    type,
    lang: lang?.join(",") ?? "",
    mini: String(mini),
  });
};

/**
 * Fetches a song's details by its token(s).
 *
 * @param token - The song token(s). Can be a single token or an array of tokens.
 * @param mini - If true (default), the song details will have lesser data. If false, the song details will have more data.
 * @returns The song details.
 */
export const getSongDetails = async (
  token: string | string[],
  mini = false
) => {
  return await musicApiInstance<SongObj>(
    "/song",
    Array.isArray(token)
      ? { id: token.join(","), mini: String(mini) }
      : { token, mini: String(mini) }
  );
};

/**
 * Fetches featured playlists.
 *
 * @param page - The page number to fetch. Defaults to 1.
 * @param n - The number of playlists to fetch per page. Defaults to 50.
 * @param lang - The languages to prioritize the data for. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the playlists will have lesser data. If false, the playlists will have more data.
 * @returns The featured playlists.
 */
export const getFeaturedPlaylists = async (
  page = 1,
  n = 50,
  lang?: Lang,
  mini = true
) => {
  return await musicApiInstance<FeaturedPlaylists>("/get/featured-playlists", {
    page: String(page),
    n: String(n),
    lang: lang ?? "",
    mini: String(mini),
  });
};

/**
 * Fetches playlist recommendations based on the given playlist ID.
 *
 * @param id - The playlist ID.
 * @param lang - The languages to prioritize the data for. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the playlist recommendations will have lesser data. If false, the playlist recommendations will have more data.
 * @returns The recommended playlists.
 */
export async function getPlaylistRecommendations(
  id: string,
  lang?: Lang[],
  mini = true
) {
  return await musicApiInstance<Playlist[]>("/playlist/recommend", {
    id,
    lang: lang?.join(",") ?? "",
    mini: String(mini),
  });
}

export async function getCharts(page = 1, n = 50, lang?: Lang, mini = true) {
  return await musicApiInstance<Chart[]>("/get/charts", {
    page: String(page),
    n: String(n),
    lang: lang ?? "",
    mini: String(mini),
  });
}
export async function getSongRecommendations(
  id: string,
  lang?: Lang[],
  mini = true
) {
  return await musicApiInstance<Song[]>("/song/recommend", {
    id,
    lang: lang?.join(",") ?? "",
    mini: String(mini),
  });
}
export async function getArtistTopSongs(
  artistId: string,
  songId: string,
  lang: Lang,
  page = 1,
  cat: Category = "latest",
  sort: Sort = "asc",
  mini = true
) {
  return await musicApiInstance<Song[]>("/artist/top-songs", {
    artist_id: artistId,
    song_id: songId,
    page: String(page),
    cat,
    sort,
    lang,
    mini: String(mini),
  });
}

export async function getTopArtists(
  page = 1,
  n = 50,
  lang?: Lang,
  mini = true
) {
  return await musicApiInstance<TopArtists>("/get/top-artists", {
    page: String(page),
    n: String(n),
    lang: lang ?? "",
    mini: String(mini),
  });
}

export async function getArtistDetails(token: string, mini = true) {
  return await musicApiInstance<Artist>("/artist", {
    token,
    n_song: "50",
    n_album: "50",
    mini: String(mini),
  });
}

/**
 * Fetches a mix's details by its token.
 *
 * @param token - The mix token.
 * @param page - The page number to fetch. Defaults to 1.
 * @param n - The number of items to fetch per page. Defaults to 20.
 * @param lang - The languages to prioritize the data for. Defaults to
 * ["hindi", "english"]. If not given, the user's preferred languages are used.
 * @param mini - If true (default), the mix details will have lesser data. If
 * false, the mix details will have more data.
 * @returns The mix details.
 */
export async function getMixDetails(
  token: string,
  page = 1,
  n = 20,
  lang: Lang[] = ["hindi", "english"],
  mini = true
) {
  return await musicApiInstance<Mix>("/get/mix", {
    token,
    page: String(page),
    n: String(n),
    lang: lang.join(","),
    mini: String(mini),
  });
}

export async function searchAll(query: string) {
  return await musicApiInstance<AllSearch>("/search", { q: query });
}

export async function search(
  query: string,
  type: "song" | "album" | "playlist" | "artist" | "show",
  page = 1,
  n = 50
): Promise<SearchReturnType> {
  return await musicApiInstance(
    `/search/${type === "show" ? "podcast" : type}s`,
    {
      q: query,
      page: String(page),
      n: String(n),
    }
  );
}

/**
 * @param token - The label token.
 * @param p - The page number.
 * @param n_song - The number of songs to fetch.
 * @param n_album - The number of albums to fetch.
 * @param cat - The category of the label.
 * @param sort - The sorting order of the label.
 * @param lang - The language of the label. If undefined, the language of the
 * user's browser is used.
 * @param mini - If true (default), the label details will have lesser data. If
 * false, the label details will have more data.
 * @returns The label details.
 */
export async function getLabelDetails(
  token: string,
  p = 0,
  n_song = 50,
  n_album = 50,
  cat: Category = "popularity",
  sort: Sort = "asc",
  lang?: Lang,
  mini = true
) {
  return await musicApiInstance<Label>("/get/label", {
    token,
    p: String(p),
    n_song: String(n_song),
    n_album: String(n_album),
    cat,
    sort,
    lang: lang ?? "",
    mini: String(mini),
  });
}

export async function getEpisodeDetails(
  token: string,
  season = 1,
  sort: Sort = "desc"
) {
  return await musicApiInstance<EpisodeDetail>("/show/episode", {
    token,
    season: String(season),
    sort,
  });
}

export async function getShowEpisodes(
  id: string,
  season = 1,
  page = 1,
  sort: Sort = "desc"
) {
  return await musicApiInstance<Episode[]>("/show/episodes", {
    id,
    season: String(season),
    page: String(page),
    sort,
  });
}

export async function getLyrics(id: string) {
  return await musicApiInstance<Lyrics>("/get/lyrics", { id });
}
