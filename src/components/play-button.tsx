"use client";
import {
  useCurrentAudioIndex,
  useIsPlayerInit,
  useQueue,
} from "@/hooks/atom-hooks";
import {
  getAlbumDetails,
  getArtistDetails,
  getEpisodeDetails,
  getLabelDetails,
  getMixDetails,
  getPlaylistDetails,
  getShowEpisodes,
  getSongDetails,
} from "@/lib/music-api-instance";
import { Episode, Song, Sort, Type } from "@/types";
import { Slot } from "@radix-ui/react-slot";
import { usePathname, useSearchParams } from "next/navigation";
import { HTMLAttributes } from "react";
import { toast } from "sonner";

type PlayButtonProps = HTMLAttributes<HTMLButtonElement> & {
  type: Type;
  token: string;
  asChild?: boolean;
};
const PlayButton = ({
  type,
  token,
  asChild,
  children,
  ...rest
}: PlayButtonProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialQueue, setQueue] = useQueue();
  const setIsPlayerInit = useIsPlayerInit()[1];
  const setCurrentSongIndex = useCurrentAudioIndex()[1];
  const sort = (searchParams.get("sort") as Sort) ?? "desc";
  const Comp = asChild ? Slot : "button";

  const handlePlay = async () => {
    // Check if the song is already in the queue
    const songIndex = initialQueue.findIndex(
      (song) => token === song.url.split("/").pop()
    );
    if (songIndex !== -1) {
      setCurrentSongIndex(songIndex);
      setIsPlayerInit(true);
      toast.success(`Playing "${initialQueue[songIndex].name}"`);
    } else {
      let queue: (Song | Episode)[] = [];
      switch (type) {
        case "album": {
          const album = await getAlbumDetails(token);
          queue = album.songs ?? [];
          break;
        }
        case "song": {
          const song = await getSongDetails(token);
          queue = song.songs ?? [];
          break;
        }
        case "playlist": {
          const playlist = await getPlaylistDetails(token);
          queue = playlist.songs ?? [];
          break;
        }
        case "mix": {
          const mix = await getMixDetails(token);
          queue = mix.songs ?? [];
          break;
        }
        case "artist": {
          const artist = await getArtistDetails(token);
          queue = artist.top_songs;
          break;
        }
        case "label": {
          const label = await getLabelDetails(token);
          queue = label.top_songs.songs;
          break;
        }
        case "episode": {
          const data = await getEpisodeDetails(token);
          queue = data.episodes;
          break;
        }
        case "show": {
          const episodes = await getShowEpisodes(
            token,
            +pathname.split("/")[3],
            1,
            sort
          );
          queue = episodes;
          break;
        }
        default:
          queue = [];
          break;
      }

      if (queue.length > 0) {
        const structuredQueue = queue.map(
          ({
            artist_map: { artists },
            id,
            name,
            subtitle,
            type,
            url,
            image,
            download_url,
            duration,
          }) => ({
            id,
            name,
            subtitle,
            type,
            url,
            image,
            download_url,
            duration,
            artists,
          })
        );

        setQueue(structuredQueue);
        setCurrentSongIndex(0);
        setIsPlayerInit(true);
        toast.success(
          `${structuredQueue.length} item${
            structuredQueue.length > 1 ? "s" : ""
          } added to queue`,
          {
            description: `Playing "${structuredQueue[0]?.name}"`,
          }
        );
      } else {
        toast.info("No songs found");
      }
    }
  };

  return (
    <Comp aria-label="play" onClick={handlePlay} {...rest}>
      {children}
    </Comp>
  );
};
export default PlayButton;
