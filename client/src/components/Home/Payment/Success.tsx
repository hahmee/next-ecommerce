"use client";

import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import React, {useCallback, useEffect, useState} from "react";
import {getSuccessPayment} from "@/apis/mallAPI";
import {useRouter} from "next/navigation";
import {Member} from "@/interface/Member";
import {setCookie} from "@/utils/cookie";
import {getCookie} from "cookies-next";
import Loading from "@/app/loading";

interface Props {
    paymentKey: string;
    orderId: string;
    amount: string;
}

const Success = ({paymentKey, orderId, amount}: Props) => {
    const router = useRouter();

    // 서버로 결제 승인 요청 보내기
    useEffect(() => {
        if (
            !orderId ||
            !paymentKey ||
            !amount
            // isLoggedIn
        )
            return;

        const getOrderConfirmData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        username: "user1@aaa.com",
                        password: "1111",
                    }),
                });

                const data: DataResponse<Member> = await response.json();
                console.log("로그인 응답:", data);
                await setCookie("member", JSON.stringify(data.data));

                console.log("payment",payment);
                // ✅ 로그인 상태 업데이트 후 useQuery 활성화
                router.push(`/order/confirmation/${paymentKey}`);

            } catch (error) {
                console.log(
                    "결제 승인 및 주문 저장과정에서 에러가 발생했습니다. " + error
                );
            }
        };

        getOrderConfirmData();

    }, [amount, orderId, paymentKey]);

    //데이터 가져온 후 다른 페이지로 이동..?
    const {data: payment, isSuccess } = useQuery<DataResponse<any>, any, any, [_1: string, _2: string]>({
        queryKey: ['payment', orderId],
        queryFn: () => getSuccessPayment({queryKey: ['payment', orderId], paymentKey, orderId, amount}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        enabled: !!getCookie("member"),
        select: useCallback((data: DataResponse<any>) => {
            return data.data;
        }, []),
    });

    return <Loading/>;

};

export default Success;