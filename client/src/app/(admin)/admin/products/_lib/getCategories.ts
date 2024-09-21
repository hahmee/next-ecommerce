import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getCategories () {

    const resultJson = await fetchWithAuth(`/api/category/`, {
        method: "GET",
        credentials: 'include',
    });

    console.log('resultJson', resultJson);

    return resultJson;

}