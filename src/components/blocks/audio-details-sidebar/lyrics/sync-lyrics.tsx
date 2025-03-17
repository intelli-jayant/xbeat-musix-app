import { useCurrentAudioDetails } from "@/hooks/atom-hooks";
import useTimer from "@/hooks/use-timer";
import { cn } from "@/lib/utils";
import { LrcData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Lrc, useRecoverAutoScrollImmediately } from "react-lrc";
import Loading from "./loading";
import PlainLyrics from "./plain-lyrics";
import LyricsNotFound from "./lyrics-not-found";
import { ScrollArea } from "@/components/ui/scroll-area";
const lrcStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
};
const SyncLyrics = ({
  view = "sync",
  setIsSync,
}: {
  view?: "sync" | "plain";
  setIsSync: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const currentAudioDetails = useCurrentAudioDetails()[0];
  const { signal } = useRecoverAutoScrollImmediately();
  const {
    data: lrc,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lyrics-details", currentAudioDetails?.id],
    queryFn: async (): Promise<LrcData | null> => {
      const params = new URLSearchParams({
        ...(currentAudioDetails && {
          track_name: currentAudioDetails.name,
          artist_name:
            currentAudioDetails.artist_map?.primary_artists[0]?.name || "",
        }),
      });
      const res = await fetch(`https://lrclib.net/api/get?${params}`);
      if (res.status === 200) {
        return res.json();
      }
      return null;
    },
    enabled: !!currentAudioDetails && !!currentAudioDetails.name,
  });

  const { currentMillisecond } = useTimer();

  useEffect(() => {
    if ((error || (!isLoading && !lrc?.syncedLyrics)) && view === "sync") {
      setIsSync(false);
    } else if (view === "plain" && !!lrc?.syncedLyrics) {
      setIsSync(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, lrc, error, setIsSync]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : view === "sync" ? (
        <>
          {!!lrc?.syncedLyrics && (
            <div className="size-full h-[calc(100dvh-378px)] lg:h-[calc(100%-114px)] relative">
              <div className="absolute h-full w-full top-0 left-0 flex flex-col">
                <Lrc
                  className="px-3 custom-scrollbar"
                  verticalSpace
                  lrc={lrc.syncedLyrics}
                  style={lrcStyle}
                  currentMillisecond={currentMillisecond}
                  recoverAutoScrollInterval={3000}
                  recoverAutoScrollSingal={signal}
                  lineRenderer={({ active, index, line }) => {
                    return (
                      <p
                        key={index}
                        className={cn(
                          active
                            ? "text-primary"
                            : "text-neutral-400 dark:text-muted-foreground",
                          "transition-all duration-150 my-1 text-center w-full text-2xl font-heading"
                        )}
                      >
                        {line.content}
                      </p>
                    );
                  }}
                />
              </div>
            </div>
          )}
          {!lrc?.syncedLyrics && <LyricsNotFound />}
        </>
      ) : (
        <ScrollArea className="h-[calc(100dvh-378px)] lg:h-[calc(100%-114px)]">
          {!!lrc?.plainLyrics && (
            <p
              dangerouslySetInnerHTML={{
                __html: lrc.plainLyrics?.replaceAll(/\n/g, "<br/>"),
              }}
              className="text-muted-foreground px-3 text-2xl font-heading"
            ></p>
          )}
          {!lrc?.plainLyrics && <PlainLyrics />}
        </ScrollArea>
      )}

      {}
    </>
  );
};
export default SyncLyrics;
