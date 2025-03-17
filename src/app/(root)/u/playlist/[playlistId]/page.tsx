import SongList from "@/components/blocks/song-list/song-list";
import ImageCollage from "@/components/image-collage";
import PlayButton from "@/components/play-button";
import { buttonVariants } from "@/components/ui/button";
import { getUserPlaylistDetails } from "@/db/queries";
import { getSongDetails } from "@/lib/music-api-instance";
import { cn, formatDuration, getImageSource } from "@/lib/utils";
import { SongObj } from "@/types";
import { Play } from "lucide-react";
import { notFound } from "next/navigation";

type PlaylistDetailsPageProps = {
  params: Promise<{ playlistId: string }>;
};
export default async function PlaylistDetailsPage({
  params,
}: PlaylistDetailsPageProps) {
  const { playlistId } = await params;
  const playlist = await getUserPlaylistDetails(playlistId);
  if (!playlist) {
    return notFound();
  }
  let songsDetails: SongObj | undefined;
  let totalDuration = "";
  let collageImageSrcs = ["/images/placeholder/playlist.jpg"];
  const { name, description, songs } = playlist;
  if (songs.length > 0) {
    songsDetails = await getSongDetails(songs);
    totalDuration = formatDuration(
      songsDetails?.songs.reduce((prev, curr) => prev + curr.duration, 0),
      "mm:ss"
    );
    collageImageSrcs = songsDetails?.songs
      ?.slice(0, 4)
      ?.map((song) =>
        getImageSource(
          song.image,
          songsDetails && songsDetails?.songs?.length < 4 ? "high" : "medium"
        )
      );
  }

  return (
    <section className="mb-4 space-y-4">
      <header>
        <figure className="flex flex-col lg:flex-row items-center lg:items-end gap-3 sm:gap-6 mb-4">
          <div
            className={cn(
              "relative aspect-square w-44 shrink-0 overflow-hidden rounded-md shadow-md md:w-56 xl:w-64"
            )}
          >
            <ImageCollage src={collageImageSrcs} />
          </div>

          <figcaption className="space-y-2 sm:space-y-4 text-center lg:text-left">
            <p className="capitalize text-muted-foreground text-sm hidden sm:block ">
              Playlist
            </p>

            <h2
              title={name}
              className="font-heading text-2xl sm:text-2xl md:text-3xl lg:text-4xl"
            >
              {name}
            </h2>

            <div className="flex flex-col lg:flex-row lg:gap-2 items-center justify-center sm:justify-start text-sm text-muted-foreground">
              {!!description && <p className="text-primary">{description}</p>}
              {songs.length > 0 && (
                <p className="text-center ">
                  {songs.length} songs,&nbsp;
                  {totalDuration}
                </p>
              )}
            </div>
          </figcaption>
        </figure>
        <div className="flex justify-end lg:justify-start">
          {songs.length > 0 && (
            <PlayButton
              type="song"
              // @ts-expect-error string[] is not assignable to string
              token={songs}
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
        <SongList items={songsDetails?.songs} />
      )}
    </section>
  );
}
