"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {PaymentTest} from "../Checkout";

const SuccessPayment = ({payments, isError = false}: { payments: PaymentTest | null, isError: boolean }) => {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    // const { orderNumber } = useOrderStore();

    // 만약 payments가 null이거나 에러가 있을 경우 처리
    // if (isError || !payments) {
    //     //에러 페이지 화면 보여준다.
    //     //router.push('/error');
    //     return <div>Error occurred or no payment data available.</div>;
    // }
    //
    useEffect(() => {
        console.log('payments..?!',payments)
        console.log('isError',isError)

        // 에러이면서 주문번호가 있으면 주문 내역 화면을 보여줍니다.
        if (isError) {
            router.push('/error');
        }

        if (payments && payments.status === 'DONE') {
            setIsLoaded(true);
        }

    }, [isError, payments, router]);


    if(!isLoaded) {
        return <div>로딩중입니다....</div>
    }

    if(!payments) {
        return null;
    }

    const {card} = payments;

    console.log('payments...', payments);
    return <div>
        <h1>결제가 완료되었습니다</h1>
        <ul>
            <li>결제 상품 {payments.orderName}</li>
            <li>주문번호 {payments.orderId} </li>
            <li>카드번호 {card.number}</li>
            <li>결제금액 {card.amount}</li>
            <li>
                결제승인날짜{" "}
                {Intl.DateTimeFormat().format(new Date(payments.approvedAt))}
            </li>
        </ul>
    </div>;
};

export default SuccessPayment;