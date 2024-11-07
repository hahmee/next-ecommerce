import {getCookie} from "@/utils/getCookieUtil";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import UserOrders from "@/components/Home/Profile/UserOrders";
import {getPayments, getUserServer} from "@/api/mallAPI";

export async function generateMetadata() {

    const member = getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 프로필`,
    }
}

export default async function OrderHistoryPage()  {

    const prefetchOptions = [
        {
            queryKey: ['user'],
            queryFn: getUserServer,
        },
        {
            queryKey: ['payments'],
            queryFn: () => getPayments  ({queryKey: ['payments']}),
        }
    ]

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <div className="container mx-auto px-4 py-8 ">
                    <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                        <UserOrders/>
                    </div>
                </div>
            </PrefetchBoundary>
        </Suspense>
);


// const queryClient = new QueryClient();
// // 데이터를 미리 가져와 캐시에 넣는다.
// await queryClient.prefetchQuery({queryKey: ['user'], queryFn: () => getUserServer()})
    //
    // const dehydratedState = dehydrate(queryClient);

    // return (
    //     // <HydrationBoundary state={dehydratedState}>
    //         <UserInfo/>
    //     // </HydrationBoundary>
    // );
}

