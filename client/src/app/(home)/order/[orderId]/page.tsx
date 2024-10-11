import {getCookie} from "@/utils/getCookieUtil";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import {getOrder} from "@/app/(home)/order/[orderId]/_lib/getOrder";
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

    console.log('params..', params);
    const {orderId} = params;

    const prefetchOptions = [
        {
            queryKey: ['orderSingle', orderId],
            queryFn: () => getOrder({orderId}),
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

