"use client";

import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {getSuccessPayment} from "@/apis/mallAPI";
import {setCookie} from "@/utils/cookie";
import Loading from "@/app/loading";
import React, {useEffect} from "react";
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";

interface Props {
    paymentKey: string;
    orderId: string;
    amount: string;
}

const SuccessPayment = ({ paymentKey, orderId, amount }: Props) => {
    const router = useRouter();
    const isProduction = process.env.NEXT_PUBLIC_MODE === 'production';

    const mutation = useMutation({
        mutationFn: async () => {
            // 로그인 요청 및 쿠키 설정 (로컬에서만 필요)

            if(!isProduction) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        username: "user2@aaa.com",
                        password: "1111",
                    }),
                });
                const data: DataResponse<Member> = await response.json();
                await setCookie("member", JSON.stringify(data.data));
            }

            // 결제 승인 (저장) API 호출
            const paymentResponse = await getSuccessPayment({
                queryKey: ["payment", orderId],
                paymentKey,
                orderId,
                amount,
            });
            return paymentResponse;
        },
        onSuccess: (result) => {
            console.log("결제 승인 후 결과:", result);
            router.push(`/order/confirmation/${paymentKey}`);
        },
        onError: (error) => {
            console.error("결제 승인 에러:", error);
        },
    });

    useEffect(() => {
        if (!orderId || !paymentKey || !amount) return;
        mutation.mutate();
    }, [orderId, paymentKey, amount]);

    return <Loading />;
};

export default SuccessPayment;
