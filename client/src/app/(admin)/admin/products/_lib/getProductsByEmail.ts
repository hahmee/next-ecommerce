

import {nextFetch} from "@/utils/jwtUtils";
import {PageParam} from "@/interface/PageParam";

export async function getProductsByEmail (pageParam: PageParam) {

    const resultJson = await nextFetch(`/api/products/adminList?page=${pageParam.page}&size=${pageParam.size}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });

    console.log('왜안난와22', resultJson);

    return resultJson;

}