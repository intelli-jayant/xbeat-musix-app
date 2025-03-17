"use client";
import React from "react";
// import { useIntersectionObserver } from "usehooks-ts";
import ListCard from "@/components/blocks/horizontal-list/list-card";
// import { getTopAlbums } from "@/lib/music-api-instance";
import type { Lang, TopAlbum } from "@/types";
// import { useInfiniteQuery } from "@tanstack/react-query";
type TopAlbumsProps = {
  initialAlbums: TopAlbum;
  lang?: Lang;
};
const TopAlbums = ({ initialAlbums, lang }: TopAlbumsProps) => {
  // const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
  //   useInfiniteQuery({
  //     queryKey: ["top-albums"],
  //     queryFn: ({ pageParam }) => getTopAlbums(pageParam, 50, lang),
  //     initialPageParam: 1,
  //     initialData: { pages: [initialAlbums], pageParams: [1] },
  //     getNextPageParam: ({ last_page }, allPages) =>
  //       last_page ? null : allPages.length + 1,
  //   });

  // const topAlbums = data.pages.flatMap((page) => page.data);
  // const onChange = useCallback(
  //   (isIntersecting: boolean) => {
  //     if (isIntersecting) fetchNextPage();
  //   },
  //   [fetchNextPage]
  // );
  // const [ref] = useIntersectionObserver({
  //   threshold: 0.5,
  //   onChange,
  // });
  return (
    <div>
      <div className="flex w-full flex-wrap">
        {initialAlbums.map(({ id, image, name, url, explicit, type, subtitle }) => (
          <ListCard
            key={id}
            name={name}
            image={image}
            url={url}
            explicit={explicit}
            type={type}
            subtitle={subtitle}
          />
        ))}
      </div>

      {/* {hasNextPage && (
        <div className="my-3" ref={ref}>
          {isFetchingNextPage && <p className="text-center">Loading...</p>}
        </div>
      )} */}
    </div>
  );
};

export default TopAlbums;
