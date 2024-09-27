"use server";
import {dehydrate, FetchQueryOptions, HydrationBoundary, QueryClient} from "@tanstack/react-query";

type Props = {
    prefetchOptions?: FetchQueryOptions[] | FetchQueryOptions;
    // prefetchInfiniteOptions?: FetchInfiniteQueryOptions[] | FetchInfiniteQueryOptions;
    prefetchInfiniteOptions?: any;
    children: React.ReactNode;
};

export async function PrefetchBoundary({prefetchOptions, prefetchInfiniteOptions, children}: Props) {
    const queryClient = new QueryClient();

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

    return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;


}