"use client";

import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {setCookie} from "@/utils/cookie";
import Loading from "@/app/loading";
import React, {useEffect} from "react";
import {sendGAEvent} from "@next/third-parties/google";

interface Props {
    paymentKey: string;
    orderId: string;
    amount: string;
}

const SuccessPayment = ({ paymentKey, orderId, amount }: Props) => {
    const router = useRouter();
    // const isProduction = process.env.NEXT_PUBLIC_MODE === 'production';

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/toss/confirm`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "결제 확인 실패");
            }

            const result = await response.json();
            console.log("결제 승인 결과:", result);

            const { accessToken, refreshToken, member } = result.data;

            await setCookie(
              "member",
              JSON.stringify({ ...member, accessToken, refreshToken })
            );

            return result;
        },
        onSuccess: (result) => {
            console.log("결제 승인 성공:", result);
            // 결제완료 이벤트 ga4에 보낸다
            sendGAEvent("purchase", {
                transaction_id: orderId,
                value: Number(amount),
                currency: "KRW",
                items: [ //todo: 실제 데이터로 변경하기
                    {
                        item_id: "SKU_12345",
                        item_name: "T‑Shirt",
                        item_brand: "Brand",
                        item_category: "Apparel",
                        price: 9.99,
                        quantity: 3
                    }
                ]
            });

            router.replace(`/order/confirmation/${paymentKey}`);
        },
        onError: (error) => {
            console.error("❌ 결제 승인 에러:", error);
        },
    });

    useEffect(() => {
        if (!orderId || !paymentKey || !amount) return;
        if (mutation.isPending || mutation.isSuccess) return; // 중복 방지
        mutation.mutate();
    }, [orderId, paymentKey, amount]);

    // useEffect(() => {
    //     if (!orderId || !paymentKey || !amount) return;
    //     mutation.mutate();
    // }, [orderId, paymentKey, amount]);

    return <Loading />;
};

export default SuccessPayment;
