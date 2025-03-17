import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-6 w-64" />
      <div className="flex flex-wrap w-full">
        {Array.from({ length: 12 }).map((_, idx) => {
          return (
            <div
              key={idx}
              className="p-3 w-full xs:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 space-y-3"
            >
              <Skeleton className="w-full aspect-square" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          );
        })}
      </div>
    </>
  );
}
