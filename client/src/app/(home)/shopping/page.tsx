import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import UserOrders from "@/components/Home/Profile/UserOrders";
import {getPayments} from "@/apis/mallAPI";
import {getCookie} from "@/utils/cookie";
import ShoppingSkeleton from "@/components/Skeleton/ShoppingSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

// <head> 메타태그 정보(title, description 등) 를 설정하는 함수
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
            queryKey: ['payments'],
            queryFn: () => getPayments({queryKey: ['payments']}),
        }
    ]

    return (
        <Suspense fallback={<ShoppingSkeleton/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ErrorHandlingWrapper>
                    <div className="container mx-auto px-4 py-8 ">
                        <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                            <UserOrders/>
                        </div>
                    </div>
                </ErrorHandlingWrapper>
            </PrefetchBoundary>
        </Suspense>
    );


}

