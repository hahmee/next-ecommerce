import {fetchWithAuth} from "@/utils/fetchWithAuth";

//
export const getProductList = async ({queryKey, page, row} : {queryKey: [string] ,page:number, row: number}) => {

    console.log('queryKey', queryKey);
    console.log('page', page);
    console.log('row', row);

    const res = await fetchWithAuth(`/api/products/list?page=${page}&size=${row}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    });

    console.log('res이죠..?', res);

    return res;

}