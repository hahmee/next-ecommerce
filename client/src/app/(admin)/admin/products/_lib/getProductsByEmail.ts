"use server";

import {nextFetch} from "@/utils/jwtUtils";

export async function getProductsByEmail() {
    const resultJson = await nextFetch(`/api/products/adminList`, {
        method: "GET",
        credentials: 'include'
    });

    console.log('왜안난와', resultJson);

    return resultJson;
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

}