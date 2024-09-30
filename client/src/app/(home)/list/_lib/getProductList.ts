import {fetchWithAuth} from "@/utils/fetchWithAuth";


export const getProductList = async ({queryKey, page, row, categoryId, colors}: {
    queryKey: [string],
    page: number,
    row: number,
    categoryId: string,
    colors: string | string[] | undefined;
}) => {

    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("size", row.toString());
    params.append("categoryId", categoryId);

    // Add each color to the query string
    if (colors) {
        if (Array.isArray(colors)) { //배열이라면
            colors.forEach((color) => params.append("color", color));
        } else { //string 타입
            params.append("color", colors);
        }
    }


    const res = await fetchWithAuth(`/api/products/list?${params.toString()}`, {
        method: "GET",
        credentials: 'include',
    });


    // const res = await fetchWithAuth(`/api/products/list?page=${page}&size=${row}&categoryId=${categoryId}`, {
    //     method: "GET",
    //     credentials: 'include',
    //     // cache: 'no-store',
    // });


    return res;

};