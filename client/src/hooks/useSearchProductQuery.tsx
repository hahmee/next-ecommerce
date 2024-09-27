import {useMemo} from "react";
import {QueryFunctionContext, useInfiniteQuery} from "@tanstack/react-query";

//사용 x
interface useSearchProductQueryProps {
    rowsPerPage: number; // 한 페이지당 불러올 상품개수
    queryFn: (context?: QueryFunctionContext) => Promise<any>;
}

const useSearchProductQuery = ({ rowsPerPage, queryFn }: useSearchProductQueryProps) => {

    const {data, isLoading, fetchNextPage, isError, isFetchingNextPage, status,} = useInfiniteQuery({
        queryKey: ['products'],
        queryFn,
        // queryFn: () => getProductList({queryKey:['products'], startCount:1, row:1}),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;

            //상품이 0개이거나 rowsPerPage보다 작을 경우 마지막 페이지로 인식한다.
            return lastPage?.data.count === 0 || lastPage?.data.count < rowsPerPage ? undefined : nextPage;
        },
        retry:0,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    })


    const products = useMemo(() => {
        const productList = data;

        return productList;
    }, [data]);

    return { products, isLoading, isError, fetchNextPage, isFetchingNextPage };
};

export default useSearchProductQuery;