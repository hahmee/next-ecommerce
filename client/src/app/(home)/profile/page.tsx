import {getCookie} from "@/utils/getCookieUtil";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import UserOrders from "@/components/Home/Profile/UserOrders";
import {getPayments} from "@/app/(home)/profile/_lib/getPayments";

export async function generateMetadata() {

    const member = getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 프로필`,
    }
}
export default async function ProfilePage()  {

    const prefetchOptions =
        {
            queryKey: ['orders'],
            queryFn: () => getPayments({queryKey: ['orders']}),
        };

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <UserOrders/>
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

