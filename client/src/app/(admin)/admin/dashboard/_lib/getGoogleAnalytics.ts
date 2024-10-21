import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getGoogleAnalytics () {

    const resultJson = await fetchWithAuth(`/api/analytics/traffic`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });


    return resultJson;

}