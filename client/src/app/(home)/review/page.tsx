import {getCookie} from "@/utils/getCookieUtil";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import UserOrders from "@/components/Home/Profile/UserOrders";
import {getUserServer} from "@/app/(home)/shopping/_lib/getUserServer";
import {getPayments} from "@/app/(home)/shopping/_lib/getPayments";
import UserReviews from "@/components/Home/Profile/UserReviews";
import {getUserReviews} from "@/app/(home)/review/_lib/getPayments";

export async function generateMetadata() {

    const member = getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 리뷰`,
    }
}
export default async function ReviewHistoryPage()  {

    const prefetchOptions = [
        {
            queryKey: ['myReviews'],
            queryFn: () => getUserReviews({queryKey: ['myReviews']}),
        }
    ]

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <div className="container mx-auto px-4 py-8 ">
                    <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                        <UserReviews/>
                    </div>
                </div>
            </PrefetchBoundary>
        </Suspense>
    );
}

