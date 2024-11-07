import {fetchJWT} from "@/utils/fetchJWT";
import {PageParam} from "@/interface/PageParam";

export async function getCategories () {
    return await fetchJWT(`/api/category/list`, {
        method: "GET",
        next: {
            tags: ['categories'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getAdminCategories (pageParam: PageParam) {
    const {page, size,search} = pageParam;
    return await fetchJWT(`/api/category/adminList?page=${page}&size=${size}&search=${search}`, {
        method: "GET",
        next: {
            tags:  ['categories'], //다시 봐
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getNewProducts () {
    return await fetchJWT(`/api/products/newProductList`, {
        method: "GET",
        next: {
            tags:  ['new-products'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getProductsByEmail (pageParam: PageParam) {
    return await fetchJWT(`/api/products/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: {
            tags:  ['adminStockProducts'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getCategory = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;

    return await fetchJWT(`/api/category/${cno}`, {
        method: "GET",
        next: {
            tags: ['cno', cno],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getCategoryPaths = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;

    return await fetchJWT(`/api/category/paths/${cno}`, {
        method: "GET",
        next: {
            tags: ['cno', cno], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });

}



export async function getOrdersByEmail (pageParam: PageParam) {

    return await fetchJWT(`/api/payments/searchAdminOrders?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: {
            tags: ['adminOrders'],
        },
        credentials: 'include',
        cache: 'no-store',
    });

}

export async function getPaymentsByEmail (pageParam: PageParam) {

    return await fetchJWT(`/api/payments/searchAdminPaymentList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: {
            tags: ['adminPayments'],
        },
        credentials: 'include',
        cache: 'no-store',
    });

}


export async function getPaymentsOverview (pageParam: PageParam) {
    return await fetchJWT(`/api/payments/paymentsOverview?startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: {
            tags: ['adminPaymentOverview'],
        },
        credentials: 'include',
        cache: 'no-store',
    });

}


export const getProduct = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;

    return await fetchJWT(`/api/products/${pno}`, {
        next: {
            tags: ['pno', pno],
        },
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getReviews = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;

    return await fetchJWT(`/api/reviews/list/${pno}`, {
        method: "GET",
        next: {
            tags: ['pno', pno],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}