"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useIsTyping } from "@/hooks/atom-hooks";
// import { parseAsString, useQueryState } from "nuqs";
// import { searchAll } from "@/lib/music-api-instance";
// import { useQuery } from "@tanstack/react-query";
// import { Loader2, X } from "lucide-react";
// import { AllSearchResults } from "./all-search-results";
// import useDebounce from "@/hooks/use-debounce";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";

const MobileSearch = () => {
  // const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [query2, setQuery2] = useState("");
  // const q = useDebounce(query, 500);
  const setIsTyping = useIsTyping()[1];
  // const { data: allSearchResults, isLoading } = useQuery({
  //   queryKey: ["search", q],
  //   queryFn: ({ queryKey }) => searchAll(queryKey[1]),
  //   enabled: !!q.trim(),
  // });
  return (
    <>
      <div className="relative">
        <Input
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          value={query2}
          onChange={(e) => setQuery2(e.target.value)}
          placeholder="Search..."
          className="pr-10"
          autoFocus
          autoComplete="on"
          name="search"
        />
        {/* {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Loader2 className="animate-spin size-5" />
          </div>
        )}
        {!isLoading && !!query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Button size="icon" variant="link" onClick={() => setQuery("")}>
              <X className="size-5" />
            </Button>
          </div>
        )} */}
      </div>

      {/* {allSearchResults && (
        <AllSearchResults data={allSearchResults} query={query} />
      )}
      {isLoading && (
        <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:space-y-0">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )} */}
    </>
  );
};

export default MobileSearch;
