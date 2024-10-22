import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {GoogleAnalyticsRequest} from "@/interface/GoogleAnalyticsRequest";

export async function getGoogleAnalytics (param: GoogleAnalyticsRequest) {

    const resultJson = await fetchWithAuth(`/api/dashboard/traffic?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });


    return resultJson;

}