"use server";
import {fetchWithAuth} from "@/utils/fetchWithAuth";


export const getProductList = async ({queryKey, page, row, categoryId, colors, productSizes}: {
    queryKey: [string, string, string[], string[]],
    page: number,
    row: number,
    categoryId: string,
    colors: string | string[] | undefined;
    productSizes: string | string[] | undefined;
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

    if(productSizes) {
        if (Array.isArray(productSizes)) { //배열이라면
            productSizes.forEach((productSize) => params.append("productSize", productSize));
        } else { //string 타입
            params.append("productSize", productSizes);
        }
    }

    console.log('...........', params.toString());
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