"use client";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const Checkout = () => {
    const handleClick = async () => {
        const tossPayments = await loadTossPayments(
            process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string
        );

        await tossPayments.requestPayment("카드", {
            amount: 5000,
            orderId: Math.random().toString(36).slice(2),
            orderName: "맥북",
            successUrl: `${window.location.origin}/order/success`,
            failUrl: `${window.location.origin}/order/fail`,
            // successUrl: `${window.location.origin}/api/payments`, // 성공적으로 진행되면 여기로 리다이렉트
            // failUrl: `${window.location.origin}/api/payments/fail`,
        });
    };
    return (
        <div>
            <button onClick={handleClick}>맥북 5000원</button>
        </div>
    );
}
export  default Checkout;