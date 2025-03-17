"use client";
import PlayButton from "@/components/play-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Type } from "@/types";
import { Pause, Play } from "lucide-react";
import React from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { useCurrentAudioIndex, useQueue } from "@/hooks/atom-hooks";

type ListPlayPauseButtonProps = {
  idx: number;
  type: Type;
  token: string;
  id: string;
};
const ListPlayPauseButton = ({
  idx,
  type,
  token,
  id,
}: ListPlayPauseButtonProps) => {
  const { playing, togglePlayPause, isReady } = useGlobalAudioPlayer();
  const [queue] = useQueue();
  const [currentAudioIndex] = useCurrentAudioIndex();
  const isCurrentAudio = queue[currentAudioIndex]?.id === id;

  return (
    <>
      {!isCurrentAudio && (
        <span className={cn("font-medium text-sm", "group-hover:hidden")}>
          {idx + 1}
        </span>
      )}

      {!isCurrentAudio ? (
        <PlayButton
          type={type}
          token={token}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "hidden group-hover:flex"
          )}
        >
          <Play strokeWidth={9} className="w-5 p-1" />
        </PlayButton>
      ) : isReady ? (
        <button
          aria-label="play"
          onClick={togglePlayPause}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          {playing ? (
            <Pause className="w-5 p-0.5 fill-muted-foreground stroke-muted-foreground hover:fill-primary hover:stroke-primary" />
          ) : (
            <Play strokeWidth={9} className="w-5 p-1" />
          )}
        </button>
      ) : (
        <PlayButton
          type={type}
          token={token}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <Play strokeWidth={9} className="w-5 p-1" />
        </PlayButton>
      )}
    </>
  );
};

export default ListPlayPauseButton;
