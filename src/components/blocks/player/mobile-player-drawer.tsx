"use client";
import ImageWithFallback from "@/components/image-with-fallback";
import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "./player-context";
import { cn, formatDuration } from "@/lib/utils";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { QueueItem } from "@/types";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentAudioIndex, useQueue } from "@/hooks/atom-hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LikeButton from "../like-button";
import { type User } from "next-auth";
import type { UserPlaylist } from "@/db/schema";
import ListMoreButton from "../song-list/list-more-button";
import LyricsTab from "../audio-details-sidebar/lyrics/lyrics-tab";
import { useQuery } from "@tanstack/react-query";
import { getUserLibrary } from "@/db/queries";

const MobilePlayerDrawer = ({
  user,
  userPlaylists,
}: {
  user?: User;
  userPlaylists?: UserPlaylist[];
}) => {
  const { data: library } = useQuery({
    queryKey: ["library", user?.id],
    queryFn: ({ queryKey }) => getUserLibrary(queryKey[1]!),
    enabled: !!user?.id,
  });
  const { playing, isLoading, looping } = useGlobalAudioPlayer();
  const [queue] = useQueue();
  const [currentAudioIndex, setCurrentAudioIndex] = useCurrentAudioIndex();
  const {
    currentAudio,
    playPauseHandler,
    handlePrev,
    handleNext,
    handleShuffle,
    handleLoop,
    isShuffle,
    isLoopPlaylist,
  } = useContext(PlayerContext)!;
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (
      showQueue &&
      currentAudioIndex !== -1 &&
      queue.length > 0 &&
      currentAudioIndex === queue.length - 1
    ) {
      setShowQueue(false);
    }
  }, [queue, currentAudioIndex, showQueue]);
  if (!currentAudio) return null;
  return (
    <section className="max-w-[320px] w-11/12 mx-auto flex flex-col items-center mb-6 mt-4">
      <Tabs defaultValue="music" className="w-full">
        <TabsContent value="music" className="space-y-8">
          <figure className="space-y-4 w-full flex flex-col items-center">
            <div className="relative aspect-square w-36 h-36 shrink-0 overflow-hidden rounded-md">
              <ImageWithFallback
                image={currentAudio.image}
                alt={currentAudio?.name}
                fill
                type="song"
              />
            </div>
            <figcaption>
              <DrawerHeader className="w-full p-0 text-left">
                <DrawerTitle>{currentAudio.name}</DrawerTitle>
                <DrawerDescription>{currentAudio.subtitle}</DrawerDescription>
              </DrawerHeader>
            </figcaption>
          </figure>
        </TabsContent>
        <TabsContent value="lyrics" className="space-y-4">
          <DrawerHeader className="w-full p-0">
            <DrawerTitle className="line-clamp-1">
              {currentAudio.name}
            </DrawerTitle>
            <DrawerDescription className="line-clamp-1">
              {currentAudio.subtitle}
            </DrawerDescription>
          </DrawerHeader>
          <LyricsTab />
        </TabsContent>
        <TabsContent value="queue" className="space-y-4">
          <DrawerHeader className="w-full p-0">
            <DrawerTitle className="line-clamp-1">
              {currentAudio.name}
            </DrawerTitle>
            <DrawerDescription className="line-clamp-1">
              {currentAudio.subtitle}
            </DrawerDescription>
          </DrawerHeader>
          {[...queue].slice(currentAudioIndex + 1).length > 0 ? (
            <div className="w-full space-y-2">
              <h4 className="font-heading text-xl">Upcoming</h4>
              <ScrollArea className="max-h-[calc(100dvh-350px)] rounded-md overflow-auto">
                <div className="py-3 space-y-3">
                  {[...queue].slice(currentAudioIndex + 1).map((item, idx) => {
                    const originalIndex = idx + currentAudioIndex + 1;
                    return (
                      <div
                        key={item.id}
                        className="col-span-6 lg:col-span-2 flex gap-3 items-center"
                        onClick={() => setCurrentAudioIndex(originalIndex)}
                      >
                        <div className="relative aspect-square w-12 h-12 shrink-0 overflow-hidden rounded-md">
                          <ImageWithFallback
                            image={item.image}
                            imageQuality="medium"
                            fill
                            alt={item.name}
                            type={item.type}
                          />
                        </div>
                        <div className="w-[calc(100%-48px)]">
                          <p className="text-sm lg:hidden text-left line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 text-left">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Play songs to see items here
            </p>
          )}
        </TabsContent>
        <div className="mt-8 space-y-4">
          <MobilePlayerDrawerAudioSlider
            currentAudio={currentAudio}
            showThumb
          />
          <div className="w-full flex items-center justify-between">
            <button
              aria-label={isShuffle ? "Disable Shuffle" : "Enable Shuffle"}
              onClick={handleShuffle}
              className={cn(!isShuffle && "text-muted-foreground")}
            >
              <Shuffle size={16} />
            </button>
            <div className="w-3/5 flex justify-between">
              <button aria-label="Previous" onClick={handlePrev}>
                <SkipBack className="dark:fill-white fill-black size-7" />
              </button>
              <button
                aria-label={playing ? "Pause" : "Play"}
                onClick={playPauseHandler}
                className="active:scale-90 transition-transform duration-100"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin lg:size-7 size-6" />
                ) : playing ? (
                  <Pause className="dark:fill-white fill-black size-7" />
                ) : (
                  <Play className="dark:fill-white fill-black size-7" />
                )}
              </button>
              <button aria-label="Next" onClick={handleNext}>
                <SkipForward className="dark:fill-white fill-black size-7" />
              </button>
            </div>
            <button
              aria-label={
                looping
                  ? "Disable repeat"
                  : isLoopPlaylist
                  ? "Repeat current song"
                  : "Repeat playlist"
              }
              onClick={handleLoop}
              className={cn(
                !looping && !isLoopPlaylist && "text-muted-foreground"
              )}
            >
              {looping ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>
        </div>

        <div className="w-full flex justify-between mt-8">
          <LikeButton
            name={currentAudio.name}
            type={currentAudio.type}
            token={currentAudio.id}
            user={user}
          />
          <TabsList>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
            <TabsTrigger
              value="queue"
              disabled={[...queue].slice(currentAudioIndex + 1).length === 0}
            >
              Queue
            </TabsTrigger>
          </TabsList>
          <ListMoreButton
            library={library}
            user={user}
            item={currentAudio}
            playlists={userPlaylists}
          />
        </div>
      </Tabs>
    </section>
  );
};

const MobilePlayerDrawerAudioSlider = ({
  currentAudio,
  showThumb = false,
}: {
  currentAudio: QueueItem;
  showThumb?: boolean;
}) => {
  const [pos, setPos] = useState(0);
  const { duration, seek, getPosition, isReady } = useGlobalAudioPlayer();
  const frameRef = useRef<number>(0);
  useEffect(() => {
    const animate = () => {
      setPos(getPosition());
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [getPosition]);
  return (
    <div className="w-full">
      <div>
        <Slider
          value={[pos]}
          max={duration}
          onValueChange={([values]) => {
            seek(values);
            setPos(values);
          }}
          disabled={!isReady}
        >
          <SliderTrack className="h-2 cursor-pointer">
            <SliderRange />
          </SliderTrack>
          {!!showThumb && (
            <SliderThumb className="size-4 cursor-pointer border-muted-foreground" />
          )}
        </Slider>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          {formatDuration(pos, pos > 3600 ? "hh:mm:ss" : "mm:ss")}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDuration(
            currentAudio.duration,
            currentAudio.duration > 3600 ? "hh:mm:ss" : "mm:ss"
          )}
        </span>
      </div>
    </div>
  );
};
export default MobilePlayerDrawer;
