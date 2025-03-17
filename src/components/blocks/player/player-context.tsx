"use client";
import {
  useCurrentAudioDetails,
  useCurrentAudioIndex,
  useIsPlayerInit,
  useQueue,
} from "@/hooks/atom-hooks";
import {
  getAlbumDetails,
  getMixDetails,
  getPlaylistDetails,
  getSongDetails,
  getSongRecommendations,
} from "@/lib/music-api-instance";
import { getDownloadLink, getRandomNumberInRange } from "@/lib/utils";
import { Episode, QueueItem, Song, Type } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { toast } from "sonner";

export const PlayerContext = createContext<{
  currentAudio: QueueItem | null;
  isShuffle: boolean;
  isLoopPlaylist: boolean;
  playPauseHandler: MouseEventHandler<HTMLButtonElement>;
  handleNext: () => void;
  handlePrev: () => void;
  handleLoop: () => void;
  handleShuffle: () => void;
} | null>(null);
export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useQueue();
  const [currentAudioIndex, setCurrentSongIndex] = useCurrentAudioIndex();
  const currentAudio = useMemo(
    () => queue[currentAudioIndex] ?? null,
    [queue, currentAudioIndex]
  );

  const { data: songDetailsResponse } = useQuery({
    queryKey: ["song-details", currentAudio?.url?.split("/")?.pop()],
    queryFn: ({ queryKey }) => getSongDetails(queryKey[1]!),
    enabled: !!currentAudio && !!currentAudio.url,
  });

  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoopPlaylist, setIsLoopPlaylist] = useState(false);
  const [isPlayerInit, setIsPlayerInit] = useIsPlayerInit();
  const { looping, togglePlayPause, load, loop, isReady, seek, playing } =
    useGlobalAudioPlayer();
  const loopingRef = useRef(looping);
  const isLoopPlaylistRef = useRef(isLoopPlaylist);
  const isShuffleRef = useRef(isShuffle);
  const queueRef = useRef(queue);
  const setCurrentAudioDetails = useCurrentAudioDetails()[1];
  const playPauseHandler = useCallback(() => {
    if (isPlayerInit) {
      togglePlayPause();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = playing ? "paused" : "playing";
      }
    } else {
      setIsPlayerInit(true);
    }
  }, [isPlayerInit, togglePlayPause, setIsPlayerInit, playing]);

  const playPauseEventHandler: MouseEventHandler<HTMLButtonElement> =
    useCallback(
      (e) => {
        e.stopPropagation();
        playPauseHandler();
      },
      [playPauseHandler]
    );

  const handleNext = useCallback(() => {
    // Initialize the player
    if (!isPlayerInit) setIsPlayerInit(true);
    let _index = currentAudioIndex;
    // set _index to random number in case of shuffle
    if (isShuffle) {
      _index = Math.floor(Math.random() * queue.length);
    } else {
      // play next song if not at the end
      if (currentAudioIndex < queue.length - 1) {
        _index = currentAudioIndex + 1;
        // play first song after end of playing is isLoopPlaylist is true
      } else if (isLoopPlaylist) _index = 0;
    }
    setCurrentSongIndex(_index);
  }, [
    isPlayerInit,
    isShuffle,
    currentAudioIndex,
    queue,
    setCurrentSongIndex,
    isLoopPlaylist,
    setIsPlayerInit,
  ]);

  const handlePrev = useCallback(() => {
    if (!isPlayerInit) setIsPlayerInit(true);
    let _index = currentAudioIndex;
    // set _index to random number in case of shuffle
    if (isShuffle) {
      _index = Math.floor(Math.random() * queue.length);
    } else {
      // play previous song if not at the start
      if (currentAudioIndex > 0) {
        _index = currentAudioIndex - 1;
        // play last song if isLoopPlaylist is true
      } else if (isLoopPlaylist) _index = queue.length - 1;
    }
    setCurrentSongIndex(_index);
  }, [
    isPlayerInit,
    queue,
    isLoopPlaylist,
    currentAudioIndex,
    setCurrentSongIndex,
    isShuffle,
    setIsPlayerInit,
  ]);
  const handlePlay = useCallback(
    async (token: string, type: Type, recommendations?: QueueItem[]) => {
      // Check if the song is already in the queue
      const songIndex = queue.findIndex(
        (song) => token === song.url.split("/").pop()
      );
      if (songIndex !== -1) {
        setCurrentSongIndex(songIndex);
        setIsPlayerInit(true);
        toast.success(`Playing "${queue[songIndex].name}"`);
      } else {
        let _queue: (Song | Episode)[] = [];
        // Check if the recommendations is available
        // if not: get the queue fron given toke
        // else: get the recommendations from the token
        if (!recommendations) {
          switch (type) {
            case "album": {
              const album = await getAlbumDetails(token);
              _queue = album.songs ?? [];
              break;
            }
            case "song": {
              const song = await getSongDetails(token);
              _queue = song.songs ?? [];
              break;
            }
            case "playlist": {
              const playlist = await getPlaylistDetails(token);
              _queue = playlist.songs ?? [];
              break;
            }
            case "mix": {
              const mix = await getMixDetails(token);
              _queue = mix.songs ?? [];
              break;
            }
            default:
              _queue = [];
              break;
          }
        } else {
          switch (type) {
            case "song": {
              const songs = await getSongRecommendations(token);
              // TODO: use reconmmendations queue to find other songs if songs is empty
              _queue = songs ?? [];
              break;
            }
            default:
              _queue = [];
              break;
          }
        }

        if (_queue.length > 0) {
          const structuredQueue = _queue.map(
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
    },
    [queue, setQueue, setCurrentSongIndex, setIsPlayerInit]
  );
  const handleOnEnd = useCallback(() => {
    let _index = currentAudioIndex;
    const lastIndex = currentAudioIndex;
    // set _index to random number in case of shuffle
    if (isShuffleRef.current) {
      _index = Math.floor(Math.random() * queueRef.current.length);
    } else {
      if (currentAudioIndex < queueRef.current.length - 1) {
        // set _index to next song if not at the end and looping is false
        if (!loopingRef.current) _index = currentAudioIndex + 1;
        // set _index to first song after end of playing is isLoopPlaylist is true
      } else {
        if (isLoopPlaylistRef.current) _index = 0;
      }
    }
    if (
      !loopingRef.current &&
      !isShuffleRef.current &&
      !isLoopPlaylistRef.current &&
      _index === lastIndex
      // TODO: add check for auto recommendations
    ) {
      const randomQueueItem =
        queueRef.current[
          getRandomNumberInRange(0, queueRef.current?.length - 1)
        ];
      handlePlay(randomQueueItem.id, randomQueueItem.type, queueRef.current);
    } else {
      setCurrentSongIndex(_index);
    }
  }, [
    currentAudioIndex,
    isShuffleRef,
    setCurrentSongIndex,
    loopingRef,
    isLoopPlaylistRef,
    handlePlay,
    queueRef,
  ]);

  const handleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const handleLoop = useCallback(() => {
    if (isReady) {
      // If the queue has only one song, toggle the loop on/off
      if (queue.length === 1) {
        loop(!looping);
        toast.success(
          looping ? "Repeat is disabled" : "Playing current song on repeat"
        );
      } else {
        // If the queue has more than one song, toggle the loop playlist on/off
        if (!looping && !isLoopPlaylist) {
          setIsLoopPlaylist(true);
          loop(false);
          toast.success("Playing current playlist on repeat");
        } else if (!looping && isLoopPlaylist) {
          setIsLoopPlaylist(false);
          loop(true); // If the loop playlist is on, set the loop to true
          toast.success("Playing current song on repeat");
        } else if (looping) {
          loop(false); // If the loop is on, set it to false
        }
      }
    }
  }, [loop, looping, queue, setIsLoopPlaylist, isLoopPlaylist, isReady]);

  const value = useMemo(
    () => ({
      currentAudio,
      handleNext,
      handlePrev,
      playPauseHandler: playPauseEventHandler,
      handleLoop,
      isShuffle,
      isLoopPlaylist,
      handleShuffle,
      handlePlay,
    }),
    [
      currentAudio,
      handleNext,
      handlePrev,
      playPauseEventHandler,
      handleLoop,
      isShuffle,
      isLoopPlaylist,
      handleShuffle,
      handlePlay,
    ]
  );

  const mediaSessionActionHandlers: [
    MediaSessionAction,
    MediaSessionActionHandler
  ][] = useMemo(
    () => [
      ["play", playPauseHandler],
      ["pause", playPauseHandler],
      ["nexttrack", handleNext],
      ["previoustrack", handlePrev],
      // [
      //   "seekbackward",
      //   (details) => {
      //     const skipTime = details.seekOffset ?? 10;
      //     seek(Math.max(getPosition() - skipTime, 0));
      //   },
      // ],
      // [
      //   "seekforward",
      //   (details) => {
      //     const skipTime = details.seekOffset ?? 10;
      //     seek(Math.max(getPosition() + skipTime, 0));
      //   },
      // ],
      [
        "seekto",
        (details) => {
          const seekTime = details.seekTime;
          if (seekTime !== undefined) {
            seek(seekTime);
            navigator.mediaSession.setPositionState({
              position: seekTime,
              duration: currentAudio.duration,
              playbackRate: 1,
            });
          }
        },
      ],
    ],
    [handleNext, handlePrev, currentAudio, playPauseHandler, seek]
  );

  useEffect(() => {
    if ("mediaSession" in navigator) {
      for (const [action, handler] of mediaSessionActionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [mediaSessionActionHandlers]);

  useEffect(() => {
    // update the current audio metadata
    if ("mediaSession" in navigator) {
      if (currentAudio) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentAudio.name,
          artist: currentAudio.subtitle,
          artwork:
            typeof currentAudio.image === "string"
              ? [{ src: currentAudio.image }]
              : currentAudio.image.map((image) => ({
                  src: image.link,
                  sizes: image.quality,
                })),
        });
        navigator.mediaSession.setPositionState({
          duration: currentAudio.duration,
          playbackRate: 1,
          position: 0,
        });
      }
    }
  }, [currentAudio]);

  useEffect(() => {
    if (!!currentAudio && isPlayerInit) {
      const audioSource = getDownloadLink(currentAudio.download_url, "high");
      load(audioSource, {
        html5: true,
        autoplay: true,
        initialMute: false,
        onend: handleOnEnd,
      });
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "playing";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudio, isPlayerInit, load]);

  useEffect(() => {
    setCurrentAudioDetails(songDetailsResponse?.songs?.[0] || null);
  }, [songDetailsResponse, setCurrentAudioDetails]);
  //   update the refs so the handleOnEnd function has updated values
  useEffect(() => {
    loopingRef.current = looping;
    isLoopPlaylistRef.current = isLoopPlaylist;
    isShuffleRef.current = isShuffle;
    queueRef.current = queue;
  }, [looping, isLoopPlaylist, isShuffle, queue]);
  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};
