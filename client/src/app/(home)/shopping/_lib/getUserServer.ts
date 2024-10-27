"use server";

import {removeCookie} from "@/utils/getCookieUtil";
import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getUserServer = async () => {
    const resultJson = await fetchWithAuth(`/api/profile`, {
        method: "GET",
        credentials: 'include', //cookie
        // cache: 'no-store',
    });

    return resultJson;
}

export const logout = async () => {

    await fetchWithAuth(`/api/member/logout`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
    });

    removeCookie("member");

    // return response;
}