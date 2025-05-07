import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import OrderDetail from "@/components/Home/Profile/OrderDetail";
import {getOrders} from "@/apis/mallAPI";
import {getCookie} from "@/utils/cookie";
import OrderDetailSkeleton from "@/components/Skeleton/OrderDetailSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

interface Props {
    params: {orderId: string }
}

export async function generateMetadata() {

    const member = await getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 프로필`,
    }
}
export default async function OrderPage({params}: Props)  {

    const {orderId} = params;

    const prefetchOptions = [
        {
            queryKey: ['orders', orderId],
            queryFn: () => getOrders({orderId}),
        }
    ]

    return (
        <Suspense fallback={<OrderDetailSkeleton/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ErrorHandlingWrapper>
                    <OrderDetail orderId={orderId}/>
                </ErrorHandlingWrapper>
            </PrefetchBoundary>
        </Suspense>
    );
}

