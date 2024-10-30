"use server";

import {removeCookie} from "@/utils/getCookieUtil";
import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getUserServer = async () => {
    return await fetchWithAuth(`/api/profile`, {
        method: "GET",
        credentials: 'include', //cookie
        // cache: 'no-store',
    });
}

export const logout = async () => {

    const resultJson = await fetchWithAuth(`/api/member/logout`, {
        method: "POST",
        credentials: 'include', //cookie
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        // cache: 'no-store',
    });

    removeCookie("member");

    return resultJson;

    // await fetchWithAuth(`/api/member/logout`, {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     credentials: 'include'
    // });


    // return response;
}