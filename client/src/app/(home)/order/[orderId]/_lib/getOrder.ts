import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getOrder({orderId}: {
    orderId: string;
}) {

    try {
        const resultJson = await fetchWithAuth(`/api/orders/${orderId}`, {
            method: "GET",
            credentials: 'include',
        });

        return resultJson;
    }catch (error:any) {
        console.log('ddddderror ', error.message);
    }


}