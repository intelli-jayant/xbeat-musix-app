"use client";
import ListCard from "@/components/blocks/horizontal-list/list-card";
// import { getFeaturedPlaylists } from "@/lib/music-api-instance";
import { FeaturedPlaylists, Lang } from "@/types";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useCallback } from "react";
// import { useIntersectionObserver } from "usehooks-ts";

type TopPlaylistsProps = {
  initialPlaylists: FeaturedPlaylists;
  lang?: Lang;
};
const TopPlaylists = ({ initialPlaylists }: TopPlaylistsProps) => {
  // const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
  //   useInfiniteQuery({
  //     queryKey: ["top-playlists"],
  //     queryFn: ({ pageParam }) => getFeaturedPlaylists(pageParam, 50, lang),
  //     initialPageParam: 1,
  //     initialData: { pages: [initialPlaylists], pageParams: [1] },
  //     getNextPageParam: ({ last_page }, allPages) =>
  //       last_page ? null : allPages.length + 1,
  //   });

  // const topPlaylists = data.pages.flatMap((page) => page.data);
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
        {initialPlaylists.map(
          ({ id, image, name, url, explicit, type, subtitle }) => (
            <ListCard
              key={id}
              name={name}
              image={image}
              url={url}
              explicit={explicit}
              type={type}
              subtitle={subtitle}
            />
          )
        )}
      </div>

      {/* {hasNextPage && (
        <div className="my-3" ref={ref}>
          {isFetchingNextPage && <p className="text-center">Loading...</p>}
        </div>
      )} */}
    </div>
  );
};
export default TopPlaylists;
