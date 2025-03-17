"use client";
import ImageWithFallback from "@/components/image-with-fallback";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getHref, getImageSource } from "@/lib/utils";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  useContext,
  useMemo,
} from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import PlayerSlider from "./player-slider";
import { PlayerContext } from "./player-context";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import DominantColorBackground from "@/components/dominant-color-background";
import type { User } from "next-auth";
import type { UserPlaylist } from "@/db/schema";
import LikeButton from "../like-button";
import ListMoreButton from "../song-list/list-more-button";
import { ToggleLyricsButton } from "./toggle-lyrics-button";
import { ToggleQueueButton } from "./toggle-queue-button";
import { useQuery } from "@tanstack/react-query";
import { getUserLibrary } from "@/db/queries";
const AudioPlayer = ({
  className,
  user,
  userPlaylists,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  user?: User;
  userPlaylists?: UserPlaylist[];
}) => {
  const { data: library } = useQuery({
    queryKey: ["library", user?.id],
    queryFn: ({ queryKey }) => getUserLibrary(queryKey[1]!),
    enabled: !!user?.id,
  });
  const { playing, isLoading, looping } = useGlobalAudioPlayer();
  const {
    currentAudio,
    isLoopPlaylist,
    handleNext,
    handlePrev,
    handleShuffle,
    isShuffle,
    handleLoop,
    playPauseHandler,
  } = useContext(PlayerContext)!;
  const imageSrc = useMemo(() => {
    if (!!currentAudio) return getImageSource(currentAudio.image, "medium");
  }, [currentAudio]);

  return (
    <DominantColorBackground imageSrc={imageSrc}>
      <section
        className={cn(
          "h-0",
          !!currentAudio &&
            "h-[72px] p-2 pb-3 lg:p-3 lg:pb-2 grid-cols-7 gap-3 grid items-center fixed bottom-16 inset-x-3 lg:static bg-background/80 backdrop-blur-md z-20 rounded-md lg:rounded-none shadow-2xl",
          className
        )}
        {...rest}
      >
        {!!currentAudio && (
          <>
            <div className="col-span-6 lg:col-span-2 flex gap-3 items-center">
              <div className="relative aspect-square w-12 h-12 shrink-0 overflow-hidden rounded-md">
                <ImageWithFallback
                  image={currentAudio.image}
                  imageQuality="medium"
                  fill
                  alt={currentAudio.name}
                  type={currentAudio.type}
                />
              </div>
              <div className="w-[calc(100%-48px)]">
                <Link
                  href={getHref(
                    currentAudio.url,
                    currentAudio.type === "song" ? "song" : "episode"
                  )}
                  className="text-sm hidden lg:line-clamp-1 hover:underline"
                >
                  {currentAudio.name}
                </Link>
                <p className="text-sm lg:hidden text-left line-clamp-1">
                  {currentAudio.name}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 text-left">
                  {currentAudio.subtitle}
                </p>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-3 flex lg:flex-col-reverse justify-end lg:justify-between gap-y-2">
              <PlayerSlider currentAudio={currentAudio} />
              <div className="flex items-center justify-between lg:justify-center gap-3 lg:gap-8">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    aria-label={
                      isShuffle ? "Disable Shuffle" : "Enable Shuffle"
                    }
                    onClick={handleShuffle}
                    className={cn(
                      !isShuffle && "text-muted-foreground",
                      "hidden lg:flex"
                    )}
                  >
                    <Shuffle size={16} />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isShuffle ? "Disable shuffle" : "Enable shuffle"}
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger aria-label="Previous" onClick={handlePrev}>
                    <SkipBack
                      size={20}
                      className="dark:fill-white fill-black hidden lg:flex"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Previous</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    aria-label={playing ? "Pause" : "Play"}
                    onClick={playPauseHandler}
                    className="active:scale-90 transition-transform duration-100"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin lg:size-7 size-6" />
                    ) : playing ? (
                      <Pause className="dark:fill-white fill-black lg:size-7 size-6" />
                    ) : (
                      <Play className="dark:fill-white fill-black lg:size-7 size-6" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>{playing ? "Pause" : "Play"}</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger aria-label="Next" onClick={handleNext}>
                    <SkipForward
                      size={20}
                      className="dark:fill-white fill-black hidden lg:flex"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Next</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    aria-label={
                      looping
                        ? "Disable repeat"
                        : isLoopPlaylist
                        ? "Repeat current song"
                        : "Repeat playlist"
                    }
                    onClick={handleLoop}
                    className={cn(
                      !looping && !isLoopPlaylist && "text-muted-foreground",
                      "hidden lg:flex"
                    )}
                  >
                    {looping ? <Repeat1 size={16} /> : <Repeat size={16} />}
                  </TooltipTrigger>
                  <TooltipContent>
                    {looping
                      ? "Disable repeat"
                      : isLoopPlaylist
                      ? "Repeat current song"
                      : "Repeat playlist"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="lg:col-span-2 hidden lg:flex justify-end items-center">
              <ToggleLyricsButton />
              <ToggleQueueButton />
              <LikeButton
                name={currentAudio.name}
                token={currentAudio.id}
                type={currentAudio.type}
                user={user}
              />
              <ListMoreButton
                user={user}
                library={library}
                playlists={userPlaylists}
                item={currentAudio}
              />
            </div>
          </>
        )}
      </section>
    </DominantColorBackground>
  );
};

export const VolumeController = () => {
  const { volume, setVolume, isReady } = useGlobalAudioPlayer();
  return (
    <div className="flex gap-2 w-full justify-between">
      <VolumeX className="size-4" />
      <Slider
        aria-label="Volume"
        disabled={!isReady}
        value={[volume * 100]}
        defaultValue={[75]}
        onValueChange={([volume]) => {
          setVolume(volume / 100);
        }}
      >
        <SliderTrack className="h-1 cursor-pointer">
          <SliderRange />
        </SliderTrack>

        <SliderThumb
          aria-label="Volume slider"
          className={cn("size-3 cursor-pointer")}
        />
      </Slider>

      <Volume2 className="size-4" />
    </div>
  );
};

export default AudioPlayer;
