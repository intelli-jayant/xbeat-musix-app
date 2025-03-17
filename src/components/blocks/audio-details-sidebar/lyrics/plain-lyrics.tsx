import { useQuery } from "@tanstack/react-query";
import React from "react";
import Loading from "./loading";
import { getLyrics } from "@/lib/music-api-instance";
import { useCurrentAudioDetails } from "@/hooks/atom-hooks";
import LyricsNotFound from "./lyrics-not-found";

const PlainLyrics = () => {
  const currentAudioDetails = useCurrentAudioDetails()[0];
  const {
    data: lyrics,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["lyrics", currentAudioDetails ? currentAudioDetails.id : null],
    queryFn: ({ queryKey }) => getLyrics(queryKey[1]!),
    enabled: !!currentAudioDetails?.id && !!currentAudioDetails?.has_lyrics,
  });

  return (
    <>
      {isLoading && <Loading />}
      {(error || (!isLoading && !lyrics)) && <LyricsNotFound />}

      {!!currentAudioDetails?.has_lyrics && lyrics && (
        <section className="text-muted-foreground">
          <div className="space-y-4">
            <p
              className="text-2xl font-heading"
              dangerouslySetInnerHTML={{ __html: lyrics.lyrics }}
            ></p>
            {/* Lyrics Copyright */}
            {/* <p
              className="font-semibold"
              dangerouslySetInnerHTML={{ __html: lyrics.lyrics_copyright }}
            ></p> */}
          </div>
        </section>
      )}
    </>
  );
};

export default PlainLyrics;
