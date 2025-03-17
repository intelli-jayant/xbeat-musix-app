import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return Array.from({ length: 6 }).map((_, idx) => {
    return <Skeleton className="h-12 w-full" key={idx} />;
  });
}
