"use client";
import SongListClientComponent from "@/components/blocks/song-list/song-list.client";
import ImageWithFallback from "@/components/image-with-fallback";
import PlayButton from "@/components/play-button";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserLibrary } from "@/db/queries";
import { getSongDetails } from "@/lib/music-api-instance";
import { cn, formatDuration } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { User } from "next-auth";
import { useMemo } from "react";

export const LikedSongs = ({ user }: { user?: User }) => {
  const { data: library, isLoading: isLoadingLibrary } = useQuery({
    queryKey: ["library", user?.id],
    queryFn: ({ queryKey }) => getUserLibrary(queryKey[1]!),
  });
  const songIds = useMemo(() => (library ? library.songs : []), [library]);
  const { data: songsDetails, isLoading: isLoadingSongsDetails } = useQuery({
    queryKey: ["library", songIds],
    queryFn: ({ queryKey }) => getSongDetails(queryKey[1]!),
    enabled: songIds.length > 0,
    placeholderData: (prev) => prev,
  });

  const totalDuration = useMemo(
    () =>
      songsDetails && songsDetails?.songs.length > 0
        ? formatDuration(
            songsDetails?.songs.reduce((prev, curr) => prev + curr.duration, 0),
            "mm:ss"
          )
        : "",
    [songsDetails]
  );

  const isLoading = isLoadingLibrary || isLoadingSongsDetails;

  return (
    <section className="mb-4 space-y-4">
      <header>
        <figure className="flex flex-col lg:flex-row items-center lg:items-end gap-3 sm:gap-6 mb-4">
          <div
            className={cn(
              "relative aspect-square w-44 shrink-0 overflow-hidden rounded-md shadow-md md:w-56 xl:w-64"
            )}
          >
            <ImageWithFallback
              src="/images/placeholder/liked-songs.svg"
              alt="liked songs"
              fill
              type="playlist"
              className={cn("size-full rounded-md object-cover")}
            />
          </div>

          <figcaption className="space-y-2 sm:space-y-4 text-center lg:text-left">
            <p className="capitalize text-muted-foreground text-sm hidden sm:block ">
              Playlist
            </p>

            <h2 className="font-heading text-2xl sm:text-2xl md:text-3xl lg:text-4xl">
              Liked Songs
            </h2>

            <div className="flex flex-col lg:flex-row lg:gap-2 items-center justify-center sm:justify-start text-sm text-muted-foreground">
              {songsDetails && songsDetails?.songs.length > 0 && (
                <p className="text-center">
                  {songsDetails?.songs?.length} songs,&nbsp;
                  {totalDuration}
                </p>
              )}
            </div>
          </figcaption>
        </figure>
        <div className="flex justify-end lg:justify-start">
          {songsDetails && songsDetails.songs.length > 0 && (
            <PlayButton
              type="song"
              // @ts-expect-error string[] is not assignable to string
              token={songIds}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "icon",
                }),
                "rounded-full h-14 w-14 active:scale-90 transition-transform duration-100"
              )}
            >
              <Play size={22} className="fill-secondary" />
            </PlayButton>
          )}
        </div>
      </header>
      {songsDetails && songsDetails.songs?.length > 0 && (
        <SongListClientComponent items={songsDetails?.songs} user={user} />
      )}
      {isLoading &&
        Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="w-full h-12" />
        ))}
      {!isLoading && (!library || !songsDetails) && (
        <div className="h-[40dvh] grid place-items-center">
          <div className="text-center ">
            <p className="text-lg font-semibold">Your library is empty!</p>
            <p className="text-muted-foreground">
              Add items to your library to see them here.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
