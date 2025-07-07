import {PageParam} from "@/interface/PageParam";
import { fetcher } from "@/utils/fetcher/fetcher";

export async function getCategories() {
    return await fetcher("/api/category/list", {
        method: "GET",
        credentials: "include",
        cache: "no-store", //  //SSR (최신 값 요청) 절대로 캐싱하지 말고, 매번 서버에서 새로 받아와라
    });
}

export async function getAdminCategories(pageParam: PageParam) {
    return await fetcher(`/api/category/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getExpertProducts() {
    return await fetcher(`/api/products/expertProducts`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getFeaturedProducts() {
    return await fetcher(`/api/products/featuredProductList`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getNewProducts() {
    return await fetcher(`/api/products/newProductList`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store', //SSR
    })
}

export async function getProductsByEmail(pageParam: PageParam) {
    return await fetcher(`/api/products/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getAllMembers(pageParam: PageParam) {
    return await fetcher(`/api/members?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getAdminStock(pageParam: PageParam) {
    return await fetcher(`/api/products/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getCategory = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;
    return await fetcher(`/api/category/${cno}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export const getCategoryPaths = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;
    return await fetcher(`/api/category/paths/${cno}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getOrdersByEmail(pageParam: PageParam) {
    return await fetcher(`/api/payments/searchAdminOrders?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getPaymentsByEmail(pageParam: PageParam) {
    return await fetcher(`/api/payments/searchAdminPaymentList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getPaymentsOverview(pageParam: PageParam) {
    return await fetcher(`/api/payments/paymentsOverview?startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}


export const getProduct = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;
    return await fetcher(`/api/products/${pno}`, {
        next: {revalidate: 60, tags: ['productSingle', pno]}, //ISR을 위해 revalidate 해서 60초마다 페이지 재생성
        method: "GET",
        credentials: 'include',
        // cache: 'no-store', //SSR 취소
    });
}


export const getReviews = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, id] = queryKey;
    return await fetcher(`/api/reviews/list/${id}`, {
        method: "GET",
        next: {revalidate: 60, tags: ['reviews', id]}, // ISR을 위해 revalidate 해서 60초마다 페이지 재생성
        credentials: 'include',
        // cache: 'no-store', SSR 취소
    });
}