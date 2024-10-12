import {getCookie} from "@/utils/getCookieUtil";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import {getOrders} from "@/app/(home)/order/[orderId]/_lib/getOrders";
import OrderDetail from "@/components/Home/Profile/OrderDetail";

interface Props {
    params: {orderId: string }
}

export async function generateMetadata() {

    const member = getCookie("member");

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
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <OrderDetail orderId={orderId}/>
            </PrefetchBoundary>
        </Suspense>
    );
}

