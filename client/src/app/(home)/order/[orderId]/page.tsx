import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import OrderDetail from "@/components/Home/Profile/OrderDetail";
import {getOrders} from "@/apis/mallAPI";
import {getCookie} from "@/utils/cookie";
import OrderDetailSkeleton from "@/components/Skeleton/OrderDetailSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import { cookies } from "next/headers";

interface Props {
    params: {orderId: string }
}

export async function generateMetadata({ params }: Props) {
    const cookieStore = cookies();
    const memberCookie = cookieStore.get("member");

    let nickname = "사용자";
    let email = "";

    try {
        const parsed = memberCookie?.value
          ? JSON.parse(decodeURIComponent(memberCookie.value))
          : null;
        if (parsed) {
            nickname = parsed.nickname || "사용자";
            email = parsed.email || "";
        }
    } catch (e) {
        // fallback 유지
    }

    const { orderId } = params;

    return {
        title: `${nickname}님의 주문 내역 #${orderId}`,
        description: `${nickname} (${email})님의 주문 상세 정보를 확인할 수 있는 페이지입니다.`,
        openGraph: {
            title: `${nickname}님의 주문 상세`,
            description: `${email}님의 주문 번호 #${orderId}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${orderId}`,
        },
        twitter: {
            card: "summary",
            title: `${nickname}님의 주문 상세`,
            description: `주문 번호 #${orderId}의 상세 내역`,
        },
    };
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

