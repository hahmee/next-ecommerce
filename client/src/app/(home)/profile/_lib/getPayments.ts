import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getPayments = async ({queryKey}: { queryKey: [string] }) => {
    console.log('queryKey....', queryKey);

    const res = await fetchWithAuth(`/api/payments/list`, {
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