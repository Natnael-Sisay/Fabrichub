import { PageLayout } from "@/components/layout/page-layout";
import { ProductDetailSkeleton } from "@/components/states";

export default function Loading() {
  return (
    <PageLayout maxWidth="6xl">
      <ProductDetailSkeleton />
    </PageLayout>
  );
}

