

import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {PageParam} from "@/interface/PageParam";
import {DataResponse} from "@/interface/DataResponse";
import {PageResponse} from "@/interface/PageResponse";
import {Product} from "@/interface/Product";
import fetchWithCredentials from "@/utils/fetchWithCredentials";
import {NextRequest} from "next/server";

export async function getProductsByEmail (pageParam: PageParam) {

    // const resultJson = await fetchWithAuth(`/api/products/adminList?page=${pageParam.page}&size=${pageParam.size}`, {
    //     method: "GET",
    //     credentials: 'include',
    //     cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    // });


    // const resultJson = await fetchWithCredentials(`/api/error/exception`, undefined);
    const resultJson = await fetchWithAuth(`/api/products/adminList?page=${pageParam.page}&size=${pageParam.size}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });

    console.log('왜안난와22', resultJson);

    return resultJson;

}