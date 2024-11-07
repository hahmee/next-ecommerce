"use server";
import {fetchJWT} from "@/utils/fetchJWT";
import {removeCookie} from "@/utils/getCookieUtil";

export const getProductList = async ({
                                         queryKey,
                                         page,
                                         row,
                                         categoryId,
                                         colors,
                                         productSizes,
                                         minPrice,
                                         maxPrice,
                                         order,
                                         query
                                     }: {
    queryKey: [string, string, string[], string[], string, string, string, string],
    page: number,
    row: number,
    categoryId: string,
    colors: string | string[] | undefined;
    productSizes: string | string[] | undefined;
    minPrice: string;
    maxPrice: string;
    order: string;
    query: string;
}) => {


    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("size", row.toString());
    params.append("categoryId", categoryId);
    params.append("minPrice", minPrice.toString());
    params.append("maxPrice", maxPrice.toString());
    params.append("order", order);
    params.append("query", query);

    // Add each color to the query string
    if (colors) {
        if (Array.isArray(colors)) { //배열이라면
            colors.forEach((color) => params.append("color", color));
        } else { //string 타입
            params.append("color", colors);
        }
    }

    if (productSizes) {
        if (Array.isArray(productSizes)) { //배열이라면
            productSizes.forEach((productSize) => params.append("productSize", productSize));
        } else { //string 타입
            params.append("productSize", productSizes);
        }
    }

    console.log('...........', params.toString());
    return await fetchJWT(`/api/products/list?${params.toString()}`, {
        method: "GET",
        next: {
            tags: ['products'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
};


export async function getOrder({id}: { id: string; }) {
    return await fetchJWT(`/api/orders/${id}`, {
        method: "GET",
        next: {
            tags: ['order',id],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getOrders({orderId}: {
    orderId: string;
}) {
    return await fetchJWT(`/api/orders/list/${orderId}`, {
        method: "GET",
        next: {
            tags: ['orders', orderId],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getSuccessPayment({queryKey, paymentKey, orderId, amount}: {
    queryKey: string[];
    paymentKey: string;
    orderId: string;
    amount: string;
}) {

    return await fetchJWT(`/api/payments/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`, {
        method: "GET",
        next: {
            tags: ['payment', orderId],
        },
        credentials: 'include',
        cache: 'no-store',
    });

}

export const getUserReviews = async ({queryKey}: { queryKey: [string] }) => {
    console.log('queryKey....', queryKey);

  return await fetchJWT(`/api/reviews/myReviews`, {
      method: "GET",
      next: {
          tags: ['myReviews'],
      },
      credentials: 'include',
      cache: 'no-store',
    });
}

export const getPayments = async ({queryKey}: { queryKey: [string] }) => {
    console.log('queryKey....', queryKey);

    return await fetchJWT(`/api/payments/list`, {
        method: "GET",
        next: {
            tags: ['payments'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getUserInfo = async () => {
    return await fetchJWT(`/api/profile`, {
        method: "GET",
        next: {
            tags: ['user'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getUserServer = async () => {
    return await fetchJWT(`/api/profile`, {
        method: "GET",
        next: {
            tags: ['user'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}


export const logout = async () => {

    const resultJson = await fetchJWT(`/api/member/logout`, {
        method: "POST",
        credentials: 'include', //cookie
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        // cache: 'no-store',
    });

    removeCookie("member");

    return resultJson;

}