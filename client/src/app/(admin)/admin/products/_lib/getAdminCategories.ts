import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {PageParam} from "@/interface/PageParam";

export async function getAdminCategories (pageParam: PageParam) {

    const resultJson = await fetchWithAuth(`/api/category/adminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        credentials: 'include',
    });

    // console.log('resultJson', resultJson);

    return resultJson;

}