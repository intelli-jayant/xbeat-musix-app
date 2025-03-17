import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="mb-4 space-y-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-3 sm:gap-6 mb-4">
        <Skeleton className="aspect-square w-44 md:w-56 xl:w-64" />
        <div className="space-y-2 sm:space-y-4">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-14 w-14" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="w-full h-12" />
        ))}
      </div>
    </section>
  );
}
