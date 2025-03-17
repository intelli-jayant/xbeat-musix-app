import type { ArtistMini } from "./artist";

export type Type =
  | "artist"
  | "album"
  | "playlist"
  | "radio"
  | "radio_station"
  | "song"
  | "channel"
  | "mix"
  | "show"
  | "episode"
  | "season"
  | "label";

export type Quality = string | { quality: string; link: string }[];

export type ImageQuality = "low" | "medium" | "high";

export type StreamQuality = "poor" | "low" | "medium" | "high" | "excellent";

export type Rights = {
  code: unknown;
  cacheable: unknown;
  delete_cached_object: unknown;
  reason: unknown;
};

export type Lang =
  | "hindi"
  | "english"
  | "punjabi"
  | "tamil"
  | "telugu"
  | "marathi"
  | "gujarati"
  | "bengali"
  | "kannada"
  | "bhojpuri"
  | "malayalam"
  | "urdu"
  | "haryanvi"
  | "rajasthani"
  | "odia"
  | "assamese";

export type Category = "latest" | "alphabetical" | "popularity";

export type Sort = "asc" | "desc";

export type QueueItem = {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  type: "song" | "episode";
  image: Quality;
  artists: ArtistMini[];
  download_url: Quality;
  duration: number;
};

export type Queue = QueueItem[];

type QualitiesMap = {
  quality: StreamQuality;
  bitrate: string;
};

export const QUALITIES_MAP: QualitiesMap[] = [
  { quality: "poor", bitrate: "12kbps" },
  { quality: "low", bitrate: "48kbps" },
  { quality: "medium", bitrate: "96kbps" },
  { quality: "high", bitrate: "160kbps" },
  { quality: "excellent", bitrate: "320kbps" },
];

export type LibraryItem = {
  id: string;
  name: string;
  songs?: string[];
  totalNumberOfSongs?: number;
  url: string | null;
  type: string;
  showActions?: boolean;
  imageSrc?: string;
};
export type LrcData = {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string;
};
