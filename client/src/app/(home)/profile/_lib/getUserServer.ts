"use server";

import {removeCookie} from "@/utils/cookieUtil";
import {nextFetch} from "@/utils/jwtUtils";

export const getUserServer = async () => {
    const resultJson = await nextFetch(`/api/profile`, {
        method: "GET",
        credentials: 'include', //cookie
        cache: 'no-store',
    });

    console.log('왜안난와', resultJson);

    return resultJson;
}

export const test = async () => {

    const resultJson = await nextFetch(`/api/member/logout`, {
        method: "POST",
        credentials: 'include'
    });

    removeCookie("member");

    // return response;
}