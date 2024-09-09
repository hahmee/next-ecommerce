import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getProduct = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;
    // const productImageStore = UseProductImageStore();

    const res = await fetchWithAuth(`/api/products/${pno}`, {
        next: {
            tags: ['pno', pno],
        },
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    });

    return res;
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // if (!res.ok) {
    //     // This will activate the closest `error.js` Error Boundary
    //     throw new Error('Failed to fetch data')
    // }

    // return res.json()
}