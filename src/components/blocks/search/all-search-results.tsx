import ImageWithFallback from "@/components/image-with-fallback";
import { Separator } from "@/components/ui/separator";
import { getHref } from "@/lib/utils";
import type { AllSearch } from "@/types";
import Link from "next/link";

type AllSearchResultsProps = {
  query: string;
  data: AllSearch;
};
export const AllSearchResults = ({ query, data }: AllSearchResultsProps) => {
  return (
    <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:space-y-0">
      {Object.entries(data)
        .sort(([, a], [, b]) => a.position - b.position)
        .map(([key, value]) => {
          if (value.data.length === 0) return null;
          return (
            <div key={key}>
              <div className="flex justify-between">
                <h5 className="capitalize font-heading text-lg">
                  {key.replace("_query", " result")}
                </h5>
                {key !== "top_query" && (
                  <Link
                    href={`/search/${key.slice(0, -1)}/${query}`}
                    className="text-xs rounded-full border px-3 py-1 grid place-items-center"
                  >
                    <span>View all</span>
                  </Link>
                )}
              </div>
              <Separator className="mt-1 mb-2" />
              {value.data.map((item) => (
                <SearchResultItem key={item.id} item={item} />
              ))}
            </div>
          );
        })}
    </div>
  );
};

type SearchResultItemProps = {
  item: AllSearch[keyof AllSearch]["data"][number];
};
export const SearchResultItem = ({ item }: SearchResultItemProps) => {
  return (
    <Link
      href={getHref(item.url, item.type)}
      className="flex gap-2 items-center mb-2"
    >
      <ImageWithFallback
        image={item.image}
        imageQuality="medium"
        alt={item.name}
        type={item.type}
        width={56}
        height={56}
      />
      <div>
        <p className="text-sm line-clamp-1">{item.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 capitalize ">
          {item.subtitle}
        </p>
      </div>
    </Link>
  );
};
