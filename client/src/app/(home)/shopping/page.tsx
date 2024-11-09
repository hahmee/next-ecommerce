import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import UserOrders from "@/components/Home/Profile/UserOrders";
import {getPayments, getUserServer} from "@/api/mallAPI";
import {getCookie} from "@/utils/cookie";

export async function generateMetadata() {

    const member = await getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 프로필`,
    }
}

export default async function OrderHistoryPage()  {

    const prefetchOptions = [
        {
            queryKey: ['userServer'],
            queryFn: getUserServer,
        },
        {
            queryKey: ['payments'],
            queryFn: () => getPayments({queryKey: ['payments']}),
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


}

