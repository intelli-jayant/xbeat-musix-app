import ImageWithFallback from "@/components/image-with-fallback";
import PlayButton from "@/components/play-button";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { cn, formatDuration, getHref, getImageSource } from "@/lib/utils";
import {
  Album,
  Artist,
  Episode,
  Label,
  Mix,
  Playlist,
  ShowDetails,
  Song,
} from "@/types";
import { Play } from "lucide-react";
import Link from "next/link";
import LikeButton from "../like-button";
import DominantColorBackground from "@/components/dominant-color-background";

type DetailsHeaderProps = {
  item: Album | Song | Playlist | Artist | Episode | ShowDetails | Label | Mix;
};
const DetailsHeader = async ({ item }: DetailsHeaderProps) => {
  const { type, image, name, id: token } = item;
  const user = await getUser();
  return (
    <header>
      <DominantColorBackground
        imageSrc={getImageSource(image, "medium")}
        className="rounded-sm overflow-hidden mb-4"
      >
        <figure className="flex flex-col lg:flex-row items-center lg:items-end gap-3 sm:gap-6 p-4">
          <div
            className={cn(
              "relative aspect-square w-44 shrink-0 overflow-hidden rounded-md shadow-md md:w-56 xl:w-64",
              (type === "artist" || type === "label") && "rounded-full"
            )}
          >
            <ImageWithFallback
              image={image}
              alt={name}
              fill
              type={type}
              className={cn(
                "size-full rounded-md object-cover",
                (type === "artist" || type === "label") && "scale-105"
              )}
            />
          </div>

          <figcaption className="space-y-2 sm:space-y-4 text-center lg:text-left">
            <p className="capitalize text-sm hidden sm:block dark:text-primary text-secondary">
              {type}
            </p>

            <h2
              title={name}
              className="font-heading text-2xl sm:text-2xl md:text-3xl lg:text-4xl dark:text-primary text-secondary"
            >
              {name}
            </h2>
            <div className="space-y-2">
              {type === "album" && (
                <div className="flex flex-col lg:flex-row lg:gap-2 items-center justify-center sm:justify-start text-sm ">
                  <p className="dark:text-primary text-secondary">
                    {item.artist_map.primary_artists.map(
                      ({ id, name, url }, idx, arr) => {
                        return (
                          <Link
                            key={id}
                            href={getHref(url, "artist")}
                            className="hover:underline text-sm"
                          >
                            {name}
                            {idx < arr.length - 1 && ","}
                          </Link>
                        );
                      }
                    )}
                  </p>
                  <p className="text-center dark:text-primary text-secondary">
                    {item.year}&nbsp;
                    {"·"}&nbsp;
                    {item.song_count} songs,&nbsp;
                    {formatDuration(item.duration, "mm:ss")}
                  </p>
                </div>
              )}
              {(type === "album" || type === "song") && (
                <Link
                  href={item.label_url || "#"}
                  className="hover:underline text-xs hidden sm:block dark:text-primary text-secondary"
                >
                  {item.copyright_text}
                </Link>
              )}
            </div>
          </figcaption>
        </figure>
      </DominantColorBackground>
      {type !== "label" && (
        <div className="flex justify-between flex-row-reverse lg:flex-row lg:justify-start items-center gap-3">
          <PlayButton
            type={item.type}
            token={
              type === "show"
                ? item.id
                : (type === "artist" ? item.urls.songs : item.url)
                    .split("/")
                    .pop()!
            }
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
          {type === "song" && (
            <LikeButton name={name} token={token} type={type} user={user} />
          )}
          {["album", "playlist", "artist"].includes(type) && (
            <LikeButton
              name={name}
              token={token}
              type={type}
              user={user}
              item={item as Album | Playlist | Artist}
            />
          )}

          {/* Download Button */}
          {/* Verticle Dots for More Options */}
        </div>
      )}
    </header>
  );
};
export default DetailsHeader;
