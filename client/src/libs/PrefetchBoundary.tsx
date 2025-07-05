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

    // const queryClient = new QueryClient();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                onError: (error) => handleApiError(error),
                retry: false, // 선택: 자동 재시도 막기
            },
            mutations: {
                onError: (error) => handleApiError(error), // mutation도 자동 처리
            },
        },
    });


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

    return <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
    </HydrationBoundary>;
}