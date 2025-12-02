import { PageLayout } from "@/components/layout/page-layout";
import { ProductCardSkeleton } from "@/components/states";

export default function Loading() {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </PageLayout>
  );
}

