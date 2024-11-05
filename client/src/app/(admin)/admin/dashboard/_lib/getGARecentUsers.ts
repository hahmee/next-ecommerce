import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {GARequest} from "@/interface/GARequest";

export async function getGARecentUsers (param: GARequest) {

    console.log('comparedEndDate ' + param.comparedEndDate);
    console.log('comparedStartDate ' + param.comparedStartDate);

    const resultJson = await fetchWithAuth(`/api/dashboard/item?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });


    return resultJson;

}