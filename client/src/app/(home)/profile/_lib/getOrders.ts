import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getOrders = async ({queryKey}: { queryKey: [string] }) => {
    const [_] = queryKey;

    const res = await fetchWithAuth(`/api/orders`, {
        // next: {
        //     tags: ['cno', cno],
        // },
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    });

    // console.log('res...', res);
    return res;

}