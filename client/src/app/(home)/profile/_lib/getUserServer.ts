"use server";

import {getCookie} from "@/utils/cookieUtil";
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
