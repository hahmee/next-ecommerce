import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import ProductTable from "@/components/Tables/ProductsTable";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";

export default async function ProducetTableSuspense() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['adminProducts'],
    queryFn: getProductsByEmail,
    initialPageParam: 0,
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductTable/>
    </HydrationBoundary>
  )
}