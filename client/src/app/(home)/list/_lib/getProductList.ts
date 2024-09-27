import {fetchWithAuth} from "@/utils/fetchWithAuth";


export const getProductList = async ({queryKey, page, row, categoryId}: {
    queryKey: [string],
    page: number,
    row: number,
    categoryId: string
}) => {

    const res = await fetchWithAuth(`/api/products/list?page=${page}&size=${row}&categoryId=${categoryId}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    });


    return res;

};