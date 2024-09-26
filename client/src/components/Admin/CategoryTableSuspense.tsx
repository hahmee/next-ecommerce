import {dehydrate, HydrationBoundary, QueryCache, QueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import CategoryTable from "@/components/Tables/CategoryTable";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";

export const queryErrorHandler = (error:Error) => {
    toast(`데이터를 가져오지 못했습니다! ${error.message}`);
};

export default async function CategoryTableSuspense() {

    // const queryClient = new QueryClient();
    const queryClient = new QueryClient({

        queryCache: new QueryCache({
            onError: (error, query) => queryErrorHandler,
        }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    })

    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            <CategoryTable/>
        </HydrationBoundary>
    )
};