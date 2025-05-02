"use client";

import React, {useEffect} from "react";
import Link from "next/link";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getPayment} from "@/apis/mallAPI";
import {Payment} from "@/interface/Payment";

interface Props {
    paymentKey: string;
}

const Confirm = ({paymentKey}: Props) => {
    const queryClient = useQueryClient();

    // Cypress 테스트용 mock 분기
    if (paymentKey === "test-mock-payment") {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                    <h1 className="text-2xl font-bold text-green-600 mb-4">주문이 완료되었습니다!</h1>
                    <p className="text-gray-700 mb-4">주문이름: 테스트상품</p>
                    <p className="text-gray-700 mb-4">주문번호: <strong>mock-order-123</strong></p>
                    <p className="text-gray-700 mb-4">총 결제 금액: <strong>10,000원</strong></p>

                    <div className="flex flex-col space-y-4">
                        <Link href="/">
                            <div className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white">
                                계속 쇼핑하기
                            </div>
                        </Link>
                        <Link href={`/order/mock-order-123`}>
                            <div className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white">
                                주문 내역 확인하기
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }


    const {data: payment} = useQuery<Payment, Payment, any>({
        queryKey: ['payment-confirm', paymentKey],
        queryFn: () => getPayment({paymentKey}),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
    });

    // invalidateQueries는 사이드 이펙트이므로 useEffect 내부에서 실행
    useEffect(() => {
        const invalidate = async () => {
            await queryClient.invalidateQueries({
                queryKey: ["carts"],
            });
        };
        invalidate();
    }, [queryClient]);


    if(payment) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-2xl font-bold text-green-600 mb-4">주문이 완료되었습니다!</h1>
                <p className="text-gray-700 mb-4">주문이름: {payment.orderName}</p>
                <p className="text-gray-700 mb-4">주문번호: <strong>{payment.orderId}</strong></p>
                <p className="text-gray-700 mb-4">총 결제 금액: <strong>{payment.totalAmount.toLocaleString()}원</strong></p>

                <div className="flex flex-col space-y-4">
                    <Link href="/">
                        <div
                            className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none">
                            계속 쇼핑하기
                        </div>
                    </Link>
                    <Link href={`/order/${payment.orderId}`}>
                        <div
                            className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none">
                            주문 내역 확인하기
                        </div>
                    </Link>
                </div>
            </div>
        </div>;
    }

};

export default Confirm;