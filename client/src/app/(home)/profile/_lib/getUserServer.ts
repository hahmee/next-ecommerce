"use server";

import {getCookie} from "@/utils/cookieUtil";
import {fetchWithInterceptor} from "@/utils/jwtUtils";

export const getUserServer = async () => {
    const resultJson = await fetchWithInterceptor(`/api/profile?email=${getCookie("member").email}`, {
        method: "GET",
        credentials: 'include', //cookie
        cache: 'no-store',
    });

    console.log('왜안난와', resultJson);

    return resultJson;

    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile?email=${getCookie("member").email}`, {
    //     method: "GET",
    //     credentials: 'include', //cookie
    //     headers: {Authorization: `Bearer ${getCookie("member").accessToken}`},
    //     cache: 'no-store',
    // });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // if (!await res.ok) {
    //     // This will activate the closest `error.js` Error Boundary
    //     throw new Error('Failed to fetch data')
    // }


    // return res.json();
}

//이렇게 하면 jwt 만료됐을때는 어떻게 처리 ?

