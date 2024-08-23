"use server";

import {removeCookie} from "@/utils/cookieUtil";
import {nextFetch} from "@/utils/jwtUtils";

export const getUserServer = async () => {
    const resultJson = await nextFetch(`/api/profile`, {
        method: "GET",
        credentials: 'include', //cookie
        cache: 'no-store',
    });

    // console.log('왜안난와', resultJson);

    return resultJson;
}

export const logout = async () => {

    await nextFetch(`/api/member/logout`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
    });

    removeCookie("member");

    // return response;
}