import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getSuccessPayment({queryKey, paymentKey, orderId, amount}: {
    queryKey: string[];
    paymentKey: string | string[] | undefined;
    orderId: string | string[] | undefined;
    amount: string | string[] | undefined;
}) {

    const resultJson = await fetchWithAuth(`/api/payment/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`, {
        method: "GET",
        credentials: 'include',
    });

    return resultJson;

}