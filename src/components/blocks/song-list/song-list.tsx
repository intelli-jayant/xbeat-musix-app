"use server";
import ImageWithFallback from "@/components/image-with-fallback";
import { cn, formatDuration, getHref } from "@/lib/utils";
import { Episode, Song } from "@/types";
import Link from "next/link";
import ListPlayPauseButton from "./list-play-pause-button";
import PlayButton from "@/components/play-button";
import ListMoreButton from "./list-more-button";
import { getUser } from "@/lib/auth";
import type { Library, UserPlaylist } from "@/db/schema";
import { getUserLibrary, getUserPlaylists } from "@/db/queries";
import LikeButton from "../like-button";

type SongListProps = {
  items: (Song | Episode)[];
  showAlbum?: boolean;
  className?: string;
  defaultVisibleCount?: number;
};

const SongList = async ({ items, showAlbum = true }: SongListProps) => {
  const user = await getUser();
  let playlists: UserPlaylist[] | undefined;
  let library: Library | undefined;
  if (!!user && !!user.id) {
    [playlists, library] = await Promise.all([
      getUserPlaylists(user.id),
      getUserLibrary(user.id),
    ]);
  }
  return (
    <section>
      <ol className="text-muted-foreground space-y-2">
        {items.map((item, idx) => (
          <li key={item.id}>
            <div className="group h-14 cursor-pointer rounded-md grid grid-cols-12 items-center gap-4 md:hover:bg-secondary transition-all">
              <div className="hidden lg:flex lg:justify-center col-span-1">
                <ListPlayPauseButton
                  idx={idx}
                  id={item.id}
                  type={item.type}
                  token={item.url.split("/").pop()!}
                />
              </div>
              <figure
                className={cn(
                  "col-span-9 flex gap-4 items-center relative",
                  showAlbum && "xl:col-span-7"
                )}
              >
                <PlayButton
                  token={item.url.split("/").pop()!}
                  type={item.type}
                  asChild
                >
                  <div className="absolute inset-0 size-full z-10 lg:hidden"></div>
                </PlayButton>
                {showAlbum && (
                  <div className="relative aspect-square h-10 shrink-0 m-w-fit overflow-hidden rounded">
                    <ImageWithFallback
                      alt={item.name}
                      image={item.image}
                      type={item.type}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <figcaption
                  className={cn(showAlbum ? "w-[calc(100%-56px)]" : "w-full")}
                >
                  <h4 className="w-full truncate text-sm text-primary">
                    <Link
                      className="hover:underline"
                      href={getHref(item.url, item.type)}
                    >
                      {item.name}
                    </Link>
                  </h4>
                  <p className="text-sm truncate">
                    {item.artist_map.artists.map((artist, artistIdx, arr) => (
                      <span key={artist.id}>
                        <Link
                          href={getHref(artist.url, artist.type)}
                          className="hover:underline hover:text-primary"
                        >
                          {artist.name}
                        </Link>
                        {artistIdx < arr.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </figcaption>
              </figure>
              {showAlbum && item.type !== "episode" && (
                <p className="col-span-2 truncate hidden xl:block text-sm">
                  <Link
                    href={getHref(item.album_url, "album")}
                    className="hover:underline hover:text-primary"
                  >
                    {item.album}
                  </Link>
                </p>
              )}

              {item.type === "episode" && (
                <p className="hidden xl:block text-sm col-span-2">
                  {new Date(item.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}

              <div className="col-span-3 lg:col-span-2 flex justify-end gap-3 items-center">
                <p className="text-sm lg:block hidden">
                  {formatDuration(item.duration, "mm:ss")}
                </p>
                <div className="flex">
                  <LikeButton
                    user={user}
                    name={item.name}
                    type={item.type}
                    token={item.id}
                  />
                  <ListMoreButton
                    user={user}
                    item={item}
                    playlists={playlists}
                    library={library}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default SongList;
