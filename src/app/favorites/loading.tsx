import { PageLayout } from "@/components/layout/page-layout";
import { ProductCardSkeleton } from "@/components/states";

export default function Loading() {
  return (
    <PageLayout>
      <div className="mb-8">
        <div className="h-9 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </PageLayout>
  );
}

