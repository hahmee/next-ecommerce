import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import ProductTable from "@/components/Tables/ProductsTable";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import {PageParam} from "@/interface/PageParam";

export default async function ProductTableSuspense({page, size} : PageParam) {


    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['adminProducts', {page, size}],
        queryFn: () => getProductsByEmail({page, size}),
    })

    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            <ProductTable page={page} size={size}/>
        </HydrationBoundary>
    )
};