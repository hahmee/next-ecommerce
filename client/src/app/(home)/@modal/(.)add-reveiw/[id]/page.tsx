import React, {Suspense} from "react";
import {getOrder} from "@/app/(home)/order/[orderId]/_lib/getOrder";
import ReviewAddModal from "@/components/Home/Profile/ReviewAddModal";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Loading from "@/app/(admin)/admin/products/loading";


interface Props {
    params: {id: string, orderId: string};
}

export default function ReviewModalPage({params}: Props) {
    const {id, orderId} = params;

    const prefetchOptions = {
        queryKey: ['order', id],
        queryFn: () => getOrder({id: id}),
    };

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ReviewAddModal id={id} orderId={orderId}/>
            </PrefetchBoundary>
        </Suspense>

    );
};
