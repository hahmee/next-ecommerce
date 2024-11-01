import {PageParam} from "@/interface/PageParam";
import {fetchWithAuth} from "@/utils/fetchWithAuth";

export async function getOrdersByEmail (pageParam: PageParam) {

    const resultJson = await fetchWithAuth(`/api/payments/searchAdminOrders?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });


    return resultJson;

}