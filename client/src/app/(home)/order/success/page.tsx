//결제 완료 페이지로 라우팅 시키기
import React, {Suspense} from "react";
import Loading from "@/app/loading";
import SuccessPayment from "@/components/Home/Payment/SuccessPayment";

interface Props {
    // searchParams: { [key: string]: string | string[] | undefined }
    searchParams: { [key: string]: string; }

}

//결제 성공 페이지
export default async function OrderSuccessPage({searchParams}: Props) {

    const {paymentKey, orderId, amount} = searchParams;

    return (
        <Suspense fallback={<Loading/>}>
            <SuccessPayment paymentKey={paymentKey} orderId={orderId} amount={amount}/>
        </Suspense>
    );

};
