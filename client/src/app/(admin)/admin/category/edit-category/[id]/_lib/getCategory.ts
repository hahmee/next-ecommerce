import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getCategory = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;

    const res = await fetchWithAuth(`/api/category/${cno}`, {
        next: {
            tags: ['cno', cno],
        },
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    });

    // console.log('res...', res);
    return res;

}