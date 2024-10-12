import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getOrders({orderId}: {
    orderId: string;
}) {

    try {
        const resultJson = await fetchWithAuth(`/api/orders/list/${orderId}`, {
            method: "GET",
            credentials: 'include',
        });

        return resultJson;
    }catch (error:any) {
        console.log('ddddderror ', error.message);
    }


}