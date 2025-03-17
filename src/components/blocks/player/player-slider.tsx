"use client";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import useThrottle from "@/hooks/use-throttle";
import { cn, formatDuration } from "@/lib/utils";
import { QueueItem } from "@/types";
import { memo, useEffect, useRef, useState } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";

const PlayerSlider = memo(({ currentAudio }: { currentAudio: QueueItem }) => {
  const [pos, setPos] = useState(0);
  const throttledPosition = useThrottle(pos, 1000);
  const { duration, seek, getPosition, isReady, playing } =
    useGlobalAudioPlayer();
  const frameRef = useRef<number>(0);
  useEffect(() => {
    if (playing) {
      const animate = () => {
        // console.log("running animate", getPosition());
        setPos(getPosition());
        frameRef.current = window.requestAnimationFrame(animate);
      };
      frameRef.current = window.requestAnimationFrame(animate);

      return () => {
        if (frameRef.current) {
          window.cancelAnimationFrame(frameRef.current);
        }
      };
    }
  }, [getPosition, setPos, playing]);
  return (
    <div className="flex gap-2 items-center fixed inset-x-0 lg:static bottom-0 w-11/12 mx-auto">
      <span className="text-xs w-12 hidden lg:inline-block">
        {formatDuration(
          throttledPosition,
          throttledPosition > 3600 ? "hh:mm:ss" : "mm:ss"
        )}
      </span>
      <Slider
        value={[throttledPosition]}
        max={duration}
        onValueChange={([values]) => {
          seek(values);
          setPos(values);
        }}
        disabled={!isReady}
      >
        <SliderTrack className="h-1 cursor-pointer">
          <SliderRange className={cn(!isReady && "bg-accent")} />
        </SliderTrack>
        <SliderThumb className="hidden size-3 cursor-pointer lg:block" />
      </Slider>
      <span className="text-xs w-12 hidden lg:inline-block">
        {formatDuration(
          currentAudio.duration,
          currentAudio.duration > 3600 ? "hh:mm:ss" : "mm:ss"
        )}
      </span>
    </div>
  );
});
PlayerSlider.displayName = "PlayerSlider";
export default PlayerSlider;
