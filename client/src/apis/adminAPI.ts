import {fetchJWT} from "@/utils/fetchJWT";
import {PageParam} from "@/interface/PageParam";

export async function getCategories() {
    const result = await fetchJWT("/api/category/list", {
        method: "GET",
        next: { tags: ["categories"] },
        credentials: "include",
        cache: "no-store",
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getAdminCategories(pageParam: PageParam) {
    const result = await fetchJWT(`/api/category/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminCategories'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getExpertProducts() {
    const result = await fetchJWT(`/api/products/expertProducts`, {
        method: "GET",
        next: { tags: ['expert-products'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getFeaturedProducts() {
    const result = await fetchJWT(`/api/products/featuredProductList`, {
        method: "GET",
        next: { tags: ['featured-products'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getNewProducts() {
    const result = await fetchJWT(`/api/products/newProductList`, {
        method: "GET",
        next: { tags: ['new-products'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getProductsByEmail(pageParam: PageParam) {
    const result = await fetchJWT(`/api/products/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminProducts'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getAllMembers(pageParam: PageParam) {
    const result = await fetchJWT(`/api/members?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminMembers'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getAdminStock(pageParam: PageParam) {
    const result = await fetchJWT(`/api/products/searchAdminList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}`, {
        method: "GET",
        next: { tags: ['adminStockProducts'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export const getCategory = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;
    const result = await fetchJWT(`/api/category/${cno}`, {
        method: "GET",
        next: { tags: ['category', cno] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export const getCategoryPaths = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, cno] = queryKey;
    const result = await fetchJWT(`/api/category/paths/${cno}`, {
        method: "GET",
        next: { tags: ['categoryPaths', cno] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getOrdersByEmail(pageParam: PageParam) {
    const result = await fetchJWT(`/api/payments/searchAdminOrders?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: { tags: ['adminOrders'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getPaymentsByEmail(pageParam: PageParam) {
    const result = await fetchJWT(`/api/payments/searchAdminPaymentList?page=${pageParam.page}&size=${pageParam.size}&search=${pageParam.search}&startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: { tags: ['adminPayments'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export async function getPaymentsOverview(pageParam: PageParam) {
    const result = await fetchJWT(`/api/payments/paymentsOverview?startDate=${pageParam.startDate}&endDate=${pageParam.endDate}`, {
        method: "GET",
        next: { tags: ['adminPaymentOverview'] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export const getProduct = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, pno] = queryKey;
    const result = await fetchJWT(`/api/products/${pno}`, {
        next: { tags: ['productSingle', pno] },
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}

export const getReviews = async ({queryKey}: { queryKey: [string, string] }) => {
    const [_, id] = queryKey;
    const result = await fetchJWT(`/api/reviews/list/${id}`, {
        method: "GET",
        next: { tags: ['reviews', id] },
        credentials: 'include',
        cache: 'no-store',
    });
    if (!result.success) throw new Error(result.message);
    return result.data;
}
