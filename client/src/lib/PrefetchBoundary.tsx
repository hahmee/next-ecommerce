"use server";
import {dehydrate, FetchQueryOptions, HydrationBoundary, QueryClient} from "@tanstack/react-query";

type Props = {
    prefetchOptions: FetchQueryOptions[] | FetchQueryOptions;
    children: React.ReactNode;
};

export async function PrefetchBoundary({prefetchOptions, children}: Props) {
    const queryClient = new QueryClient();

    // console.log('prefetchOptionsprefetchOptions입니다..', prefetchOptions);
    Array.isArray(prefetchOptions)
        ? await Promise.all(prefetchOptions.map((prefetchOption) => queryClient.prefetchQuery(prefetchOption)))
        : await queryClient.prefetchQuery(prefetchOptions);

    return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}