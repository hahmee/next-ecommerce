import {fetchJWT} from "@/utils/fetchJWT";
import {PageParam} from "@/interface/PageParam";
import {unwrap} from "@/utils/unwrap";

export async function getCategories() {
    return unwrap(await fetchJWT("/api/category/list", {
        method: "GET",
        next: { tags: ["categories"] },
        credentials: "include",
        cache: "no-store", //  //SSR (최신 값 요청) 절대로 캐싱하지 말고, 매번 서버에서 새로 받아와라
    }));
}

export async function getAdminCategories(pageParam: PageParam) {
    return unwrap(await fetchJWT(`/api/category/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminCategories'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getExpertProducts() {
    return unwrap(await fetchJWT(`/api/products/expertProducts`, {
        method: "GET",
        next: { tags: ['expert-products'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getFeaturedProducts() {
    return unwrap(await fetchJWT(`/api/products/featuredProductList`, {
        method: "GET",
        next: { tags: ['featured-products'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getNewProducts() {
    return unwrap(await fetchJWT(`/api/products/newProductList`, {
        method: "GET",
        next: { tags: ['new-products'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getProductsByEmail(pageParam: PageParam) {
    return unwrap(await fetchJWT(`/api/products/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminProducts'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getAllMembers(pageParam: PageParam) {
    return unwrap(await fetchJWT(`/api/members?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminMembers'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getAdminStock(pageParam: PageParam) {
    return unwrap(await fetchJWT(`/api/products/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminStockProducts'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export const getCategory = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;
    return unwrap(await fetchJWT(`/api/category/${cno}`, {
        method: "GET",
        next: { tags: ['category', cno] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export const getCategoryPaths = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;
    return unwrap(await fetchJWT(`/api/category/paths/${cno}`, {
        method: "GET",
        next: { tags: ['categoryPaths', cno] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getOrdersByEmail(pageParam: PageParam) {
    return unwrap(await fetchJWT(`/api/payments/searchAdminOrders?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: { tags: ['adminOrders'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getPaymentsByEmail(pageParam: PageParam) {
    return unwrap(await fetchJWT(`/api/payments/searchAdminPaymentList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: { tags: ['adminPayments'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getPaymentsOverview(pageParam: PageParam) {
    return unwrap(await fetchJWT(`/api/payments/paymentsOverview?startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: { tags: ['adminPaymentOverview'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export const getProduct = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;
    return unwrap(await fetchJWT(`/api/products/${pno}`, {
        next: { revalidate: 60, tags: ['productSingle', pno] }, //ISR을 위해 revalidate 해서 60초마다 페이지 재생성
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    }));
}

export const getReviews = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, id] = queryKey;
    return unwrap(await fetchJWT(`/api/reviews/list/${id}`, {
        method: "GET",
        next: { revalidate: 60, tags: ['reviews', id] }, //ISR을 위해 revalidate 해서 60초마다 페이지 재생성
        credentials: 'include',
        // cache: 'no-store', SSR 취소
    }));
}