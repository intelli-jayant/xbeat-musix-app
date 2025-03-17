import ImageWithFallback from "@/components/image-with-fallback";
import { Type, type LibraryItem } from "@/types";
import React from "react";
import VerticalMoreButton from "./vertical-more-button";
import { type User } from "next-auth";
import Link from "next/link";
const LibraryItemLink = ({
  data,
  user,
}: {
  data: LibraryItem;
  user?: User;
}) => {
  const {
    id,
    name,
    songs,
    url,
    type,
    showActions,
    imageSrc,
    totalNumberOfSongs,
  } = data;

  const numberOfSongs = (songs && songs.length) || totalNumberOfSongs || 0;
  return (
    <Link
      key={id}
      href={url || `/u/${type}/${id}`}
      className="dark:bg-neutral-950 shadow-sm rounded-md overflow-hidden border dark:border-none"
    >
      <div className="h-12 gap-3 flex items-center justify-between mr-1">
        <div className="flex gap-3 items-center">
          <ImageWithFallback
            type={type as Type}
            alt={name}
            width={48}
            height={48}
            src={imageSrc}
          />
          <div className="pr-6">
            <p className="text-sm line-clamp-1">{name}</p>
            <div className="text-xs text-muted-foreground capitalize flex gap-1">
              <span>{type}</span>
              {numberOfSongs > 0 && (
                <>
                  <span className="font-bold">·</span>
                  <span className="">{numberOfSongs}&nbsp;songs</span>
                </>
              )}
            </div>
          </div>
        </div>
        {!!showActions && (
          <VerticalMoreButton
            playlistId={id}
            userId={user?.id}
            playlistName={name}
          />
        )}
      </div>
    </Link>
  );
};

export default LibraryItemLink;
