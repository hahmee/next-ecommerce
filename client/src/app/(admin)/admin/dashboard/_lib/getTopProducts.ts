import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {TopCustomerRequest} from "@/interface/TopCustomerRequest";

export async function getTopProducts (param: TopCustomerRequest) {

    const resultJson = await fetchWithAuth(`/api/dashboard/salesProducts?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });


    return resultJson;

}