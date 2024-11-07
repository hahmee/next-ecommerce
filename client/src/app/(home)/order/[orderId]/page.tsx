import {getCookie} from "@/utils/getCookieUtil";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import OrderDetail from "@/components/Home/Profile/OrderDetail";
import {getOrders} from "@/api/mallAPI";

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

