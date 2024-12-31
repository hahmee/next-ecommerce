import {fetchJWT} from "@/utils/fetchJWT";
import {PageParam} from "@/interface/PageParam";

export async function getCategories () {
    return await fetchJWT(`/api/category/list`, {
        method: "GET",
        next: {
            tags: ['categories'], // 외부 API next.tags 옵션은 필요 X
        },
        credentials: 'include',
        cache: 'no-store', //브라우저 캐시를 사용하지 않고, 항상 서버에서 최신 데이터를 받아옴
    });
}

export async function getAdminCategories (pageParam: PageParam) {
    const {page, size,search} = pageParam;
    return await fetchJWT(`/api/category/searchAdminList?page=${page}&size=${size}&search=${search}`, {
        method: "GET",
        next: {
            tags:  ['adminCategories'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getFeaturedProducts() {
    return await fetchJWT(`/api/products/featuredProductList`, {
        method: "GET",
        next: {
            tags: ['featured-products'],
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
            tags:  ['adminProducts'],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getAdminStock (pageParam: PageParam) {
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
            tags: ['category', cno],
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
            tags: ['categoryPaths', cno],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getOrdersByEmail (pageParam: PageParam) {
    return await fetchJWT(`/api/payments/searchAdminOrders?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: {
            tags: ['adminOrders'], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getPaymentsByEmail (pageParam: PageParam) {

    return await fetchJWT(`/api/payments/searchAdminPaymentList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: {
            tags: ['adminPayments'], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });

}


export async function getPaymentsOverview (pageParam: PageParam) {
    return await fetchJWT(`/api/payments/paymentsOverview?startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: {
            tags: ['adminPaymentOverview'], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });

}


export const getProduct = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;

    return await fetchJWT(`/api/products/${pno}`, {
        next: {
            tags: ['productSingle', pno],
        },
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getReviews = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, id] = queryKey;

    return await fetchJWT(`/api/reviews/list/${id}`, {
        method: "GET",
        next: {
            tags: ['reviews', id],
        },
        credentials: 'include',
        cache: 'no-store',
    });
}