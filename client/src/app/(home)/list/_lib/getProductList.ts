import {fetchWithAuth} from "@/utils/fetchWithAuth";

//
export const getProductList = async ({queryKey, startCount, row} : {queryKey: [string] ,startCount:number, row: number}) => {

    console.log('queryKey', queryKey);
    console.log('queryKey', startCount);

    const res = await fetchWithAuth(`/api/products/list?page=${1}&size=${10}`, {
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    });

    console.log('res이죠..?', res);

    return res;

}