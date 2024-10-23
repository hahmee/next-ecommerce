//결제 완료 페이지로 라우팅 시키기
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import React, {Suspense} from "react";
import {getSuccessPayment} from "@/app/(home)/order/success/_lib/getSuccessPayment";
import Loading from "@/app/(admin)/admin/products/loading";
import SuccessPayment from "@/components/Home/Payment/SuccessPayment";

interface Props {
    // searchParams: { [key: string]: string | string[] | undefined }
    searchParams: { [key: string]: string; }

}

//결제 성공 페이지
export default async function OrderSuccessPage({searchParams}: Props) {

    console.log('searchParams', searchParams);
    const {paymentKey, orderId, amount} = searchParams;

    //결제 요청이 토스페이먼츠로 전송되고 성공했을 때 url로 orderId, paymentKey, amount가 나오는데 그 값들을 스프링으로 넘겨준다.
    const prefetchOptions = {
        queryKey: ['payment', orderId],
        queryFn: () => getSuccessPayment({queryKey: ['payment', orderId], paymentKey, orderId, amount}), // queryKey를 전달하여 호출
    };

    return <Suspense fallback={<Loading/>}>
        <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <SuccessPayment paymentKey={paymentKey} orderId={orderId} amount={amount}/>
        </PrefetchBoundary>
    </Suspense>;





    // const {paymentKey, orderId, amount} = searchParams;
    //
    // const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY || "";
    // const basicToken = Buffer.from(`${secretKey}:`, `utf-8`).toString("base64");
    //
    // const url = `https://api.tosspayments.com/v1/payments/confirm`;
    //
    // const result = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //         Authorization: `Basic ${basicToken}`,
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         paymentKey,
    //         orderId,
    //         amount,
    //     }),
    //
    // });
    //
    // // 상태 코드가 200번대가 아니면 에러 처리
    // if (!result.ok) {
    //     const errorData = await result.json(); // 에러 응답 JSON을 파싱
    //     console.log('?zz', errorData);
    //
    //     redirect(`/order/fail?code=${errorData.code}&message=${encodeURIComponent(errorData.message)}`);
    //
    // }
    //
    //
    // const payments = await result.json();
    //
    // console.log('payments진짜', payments);
    //
    // //db처리
    //
    // return <SuccessPayment payments={payments} isError={false}/>;

};
