import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getSuccessPayment({queryKey, paymentKey, orderId, amount}: {
    queryKey: string[];
    paymentKey: string | string[] | undefined;
    orderId: string | string[] | undefined;
    amount: string | string[] | undefined;
}) {

    try {
        const resultJson = await fetchWithAuth(`/api/payments/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`, {
            method: "GET",
            credentials: 'include',
        });

        console.log('resultJson?????????? ', resultJson);

        return resultJson;
    }catch (error:any) {
        console.log('ddddderror ', error.message);
    }


}