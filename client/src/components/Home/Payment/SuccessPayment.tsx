"use client";

import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import React, {useCallback} from "react";
import {getSuccessPayment} from "@/app/(home)/order/success/_lib/getSuccessPayment";
import Link from "next/link";

interface Props {
    paymentKey: string | undefined | string[];
    orderId: string | undefined | string[];
    amount: string | undefined | string[];
}

const SuccessPayment = ({paymentKey, orderId, amount}: Props) => {

    //데이터 가져온 후 다른 페이지로 이동..?
    const {data: payment, error} = useQuery<DataResponse<any>, any, any, [_1: string]>({
        queryKey: ['payment'],
        queryFn: () => getSuccessPayment({queryKey: ['payment'], paymentKey, orderId, amount}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        select: useCallback((data: DataResponse<any>) => {
            return data.data;
        }, []),

    });

    console.log('payments..', payment);

    if(error) {
        console.log('error', error);
    }

    // success 페이지에서 새로고침시 다른 에러가 발생할 수 있다. 따라서 처리를 해줘야 한다.
    if(!payment) {
        //에러 페이지로 전환
        //서버에서 내려준 걸 에러 코드와 메시지로..
        // router.push(`/order/fail?code=${}&message=${}`);
        return null;
    }

    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h1 className="text-2xl font-bold text-green-600 mb-4">주문이 완료되었습니다!</h1>
            <p className="text-gray-700 mb-4">주문이름: {payment.orderName}</p>
            <p className="text-gray-700 mb-4">주문번호: <strong>{payment.orderId}</strong></p>
            <p className="text-gray-700 mb-4">총 결제 금액: <strong>{payment.totalAmount.toLocaleString()}원</strong></p>
            <p className="text-gray-700 mb-6">카드번호: {payment.card.number}</p>

            <div className="flex flex-col space-y-4">
                <Link href="/">
                    <div
                        className="text-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">
                        계속 쇼핑하기
                    </div>
                </Link>
                <Link href={`/order/${payment.orderId}`}>
                    <div
                        className="text-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition">
                        주문 내역 확인하기
                    </div>
                </Link>
            </div>
        </div>
    </div>;


};

export default SuccessPayment;