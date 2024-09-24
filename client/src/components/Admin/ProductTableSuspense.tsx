import {dehydrate, HydrationBoundary, QueryCache, QueryClient} from "@tanstack/react-query";
import ProductTable from "@/components/Tables/ProductsTable";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import {PageParam} from "@/interface/PageParam";
import toast from "react-hot-toast";

export const queryErrorHandler = (error:Error) => {
    toast(`데이터를 가져오지 못했습니다! ${error.message}`);
};

export default async function ProductTableSuspense({page, size,search} : PageParam) {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error, query) => queryErrorHandler,
        }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['adminProducts', {page, size, search}],
        queryFn: () => getProductsByEmail({page, size,search}),
    })

    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            <ProductTable page={page} size={size}/>
        </HydrationBoundary>
    )
};