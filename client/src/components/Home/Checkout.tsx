"use client";
import { loadTossPayments } from "@tosspayments/payment-sdk";

export interface ErrorPaymentResponse {
    response: {
        data: {
            message: string;
            code: string;
        };
    };
}

export interface Payment {
    orderName: string;
    approvedAt: string;
    receipt: {
        url: string;
    };
    totalAmount: number;
    method: '카드' | '가상계좌' | '계좌이체';
    paymentKey: string;
    orderId: string;
    card: {amount:number, number: number;}

    status:
        | 'READY'
        | 'IN_PROGRESS'
        | 'WAITING_FOR_DEPOSIT'
        | 'DONE'
        | 'CANCELED'
        | 'PARTIAL_CANCELED'
        | 'ABORTED'
        | 'EXPIRED';
}

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
        });
    };
    return (
        <div>
            <button onClick={handleClick}>맥북 5000원</button>
        </div>
    );
}
export  default Checkout;