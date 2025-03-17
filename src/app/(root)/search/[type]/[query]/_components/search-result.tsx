"use client";
import ListCard from "@/components/blocks/horizontal-list/list-card";
import SongList from "@/components/blocks/song-list/song-list.client";
import { getUserLibrary } from "@/db/queries";
import type { UserPlaylist } from "@/db/schema";
import { search } from "@/lib/music-api-instance";
import type { Album, SearchReturnType, Song } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { User } from "next-auth";
import { useIntersectionObserver } from "usehooks-ts";

type SearchResultsProps = {
  query: string;
  type: "song" | "album" | "playlist" | "artist" | "show";
  initialSearchResults: SearchReturnType;
  user?: User;
  playlists?: UserPlaylist[];
};

export const SearchResults = ({
  query,
  type,
  initialSearchResults,
  user,
  playlists,
}: SearchResultsProps) => {
  const { data: library } = useQuery({
    queryKey: ["library", user?.id],
    queryFn: ({ queryKey }) => getUserLibrary(queryKey[1]!),
    enabled: !!user?.id,
  });
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["search-results", type, query],
      queryFn: ({ pageParam }) => search(query, type, pageParam, 50),
      getNextPageParam: ({ total }, allPages) =>
        allPages.length * 50 < total ? allPages.length + 1 : undefined,
      initialPageParam: 1,
      initialData: { pages: [initialSearchResults], pageParams: [1] },
    });

  const searchResults = data.pages.flatMap(
    (page) => page.results as (Album | Song)[]
  );

  const [ref] = useIntersectionObserver({
    threshold: 0.5,
    onChange(isIntersecting) {
      if (isIntersecting) {
        fetchNextPage();
      }
    },
  });

  return (
    <>
      {type === "song" ? (
        <>
          <SongList
            items={searchResults as Song[]}
            user={user}
            playlists={playlists}
            library={library}
          />
        </>
      ) : (
        <div className="flex flex-wrap w-full gap-y-4">
          {searchResults.map(
            ({ id, name, url, subtitle, type, image }, idx) => (
              <ListCard
                key={`${id}-${idx}`}
                image={image}
                name={name}
                type={type}
                url={url}
                subtitle={subtitle}
              />
            )
          )}
        </div>
      )}

      {hasNextPage && (
        <div className="flex items-center justify-center gap-1 my-2" ref={ref}>
          {isFetchingNextPage && (
            <>
              <Loader2 className="size-5 animate-spin" />
              &nbsp;Loading...
            </>
          )}
        </div>
      )}
    </>
  );
};
