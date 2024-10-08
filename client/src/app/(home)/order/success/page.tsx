//결제 완료 페이지로 라우팅 시키기
import SuccessPayment from "@/components/Home/Payment/SuccessPayment";
import {ErrorPaymentResponse} from "@/components/Home/Checkout";

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function OrderSuccessPage({ searchParams }:Props) {

    console.log('searchParams', searchParams);
    const {paymentKey , orderId, amount } = searchParams;

    const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY || "";
    const basicToken = Buffer.from(`${secretKey}:`, `utf-8`).toString("base64");

    const url = `https://api.tosspayments.com/v1/payments/confirm`;

    try {

        const result = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount,
            }),

        });

        // 상태 코드가 200번대가 아니면 에러 처리
        if (!result.ok) {
            console.log('?zz');
            const errorData = await result.json(); // 에러 응답 JSON을 파싱
            // throw new Error(errorData.message || 'Payment processing error');
            // return Promise.reject(errorData);
            throw new Error(errorData.message || 'Payment processing error');

        }


        const payments = await result.json();

        console.log('payments진짜', payments);

        return <SuccessPayment payments={payments} isError={false}/>;


    }catch(err:unknown) {

        const error = err as ErrorPaymentResponse;

        if (error.response?.data.code === 'ALREADY_PROCESSED_PAYMENT') { // 이미 처리된 결제
            //
            console.log('이게 나오나??')
            return <SuccessPayment payments={null} isError={true}/>;

        }

        return {
            redirect: {
                destination: `/order/fail?code=${error.response.data.code}&message=${encodeURIComponent(
                    error.response.data.message,
                )}`,
                permanent: false,
            },
        };

    }



};
