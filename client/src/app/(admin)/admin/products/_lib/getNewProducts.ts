import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getNewProducts () {

    const resultJson = await fetchWithAuth(`/api/products/newProductList`, {
        method: "GET",
        credentials: 'include',
    });

    // console.log('resultJson', resultJson);

    return resultJson;

}