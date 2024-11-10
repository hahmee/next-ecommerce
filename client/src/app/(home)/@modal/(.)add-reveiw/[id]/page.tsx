import React, {Suspense} from "react";
import ReviewAddModal from "@/components/Home/Profile/ReviewAddModal";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Loading from "@/app/(admin)/admin/products/loading";
import {getOrder} from "@/api/mallAPI";


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
