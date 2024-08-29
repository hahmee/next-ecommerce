import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getProductServer = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;
    console.log('pno', pno);
    const res = await fetchWithAuth(`/api/products/${pno}`, {
        next: {
            tags: ['pno', pno],
        },
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
        // headers: {Cookie: cookies().toString()},
    });
    console.log('res', res);
    return res;
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // if (!res.ok) {
    //     // This will activate the closest `error.js` Error Boundary
    //     throw new Error('Failed to fetch data')
    // }

    // return res.json()
}