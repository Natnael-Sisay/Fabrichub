import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white rounded-xl p-0 max-w-60">
      <div className="relative h-36 bg-muted">
        <Skeleton className="h-full w-full" />

        <div className="absolute top-2 right-2">
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>

      <div className="p-2 space-y-1.5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </Card>
  );
}
