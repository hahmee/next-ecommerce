import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {ChartRequest} from "@/interface/ChartRequest";

export async function getSalesCharts (param: ChartRequest) {

    const resultJson = await fetchWithAuth(`/api/dashboard/salesOverview?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });


    return resultJson;

}