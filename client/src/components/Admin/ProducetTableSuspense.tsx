import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import ProductTable from "@/components/Tables/ProductsTable";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";

export default async function ProducetTableSuspense() {
  const page = 1;
  const size = 10;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['adminProducts', {page, size}],
    queryFn: () => getProductsByEmail({page, size}),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductTable/>
    </HydrationBoundary>
  )
}