import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getUserInfo = async () => {
    const resultJson = await fetchWithAuth(`/api/profile`, {
        method: "GET",
        credentials: 'include', //cookie
        // cache: 'no-store',
    });

    return resultJson;
}
