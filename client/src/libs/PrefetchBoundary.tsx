"use server";
import {
    dehydrate,
    FetchInfiniteQueryOptions,
    FetchQueryOptions,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import {ReactNode} from "react";

type Props = {
    prefetchOptions?: FetchQueryOptions[] | FetchQueryOptions | undefined;
    prefetchInfiniteOptions?: FetchInfiniteQueryOptions[] | FetchInfiniteQueryOptions | undefined;
    children: ReactNode;
};

export async function PrefetchBoundary({
                                           prefetchOptions,
                                           prefetchInfiniteOptions,
                                           children
                                       }: Props) {

    //QueryClient: 데이터 캐시 저장소
    const queryClient = new QueryClient();

    //prefetchQuery() / prefetchInfiniteQuery() -> 서버에서 데이터를 미리 요청 하고 캐시에 저장
    if (prefetchOptions) {
        Array.isArray(prefetchOptions)
            ? await Promise.all(prefetchOptions.map((prefetchOption) => queryClient.prefetchQuery(prefetchOption)))
            : await queryClient.prefetchQuery(prefetchOptions);
    }

    //무한 스크롤링일 때
    if (prefetchInfiniteOptions) {
        Array.isArray(prefetchInfiniteOptions)
            ? await Promise.all(prefetchInfiniteOptions.map((prefetchOption) => queryClient.prefetchInfiniteQuery(prefetchOption)))
            : await queryClient.prefetchInfiniteQuery(prefetchInfiniteOptions);
    }

    //dehydrate : 캐시된 데이터 직렬화 시킨다
    //HydrationBoundary: 직렬화된 캐시를 클라이언트에 전달하여 hydrate(복원)처리
    return <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
    </HydrationBoundary>;
}