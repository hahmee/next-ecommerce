"use server";

import {nextFetch} from "@/utils/jwtUtils";
import {PageParam} from "@/interface/PageParam";

export async function getProductsByEmail (pageParam: PageParam) {
    const {page, size} = pageParam;
    console.log('pageParam', page, size);

    const resultJson = await nextFetch(`/api/products/adminList?page=${page}&size=${size}`, {
        method: "GET",
        credentials: 'include'
    });

    console.log('왜안난와', resultJson);

    return resultJson;
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

}