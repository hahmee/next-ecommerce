"use server";

import {nextFetch} from "@/utils/jwtUtils";
import {PageParam} from "@/interface/PageParam";

export async function getProductsByEmail (pageParam: PageParam) {

    const resultJson = await nextFetch(`/api/products/adminList?page=${pageParam.page}&size=${pageParam.size}`, {
        method: "GET",
        credentials: 'include'
    });

    console.log('왜안난와', resultJson);

    return resultJson;
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

}