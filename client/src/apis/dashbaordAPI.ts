import {GARequest} from "@/interface/GARequest";
import {fetchJWT} from "@/utils/fetchJWT";
import {TopCustomerRequest} from "@/interface/TopCustomerRequest";
import {ChartRequest} from "@/interface/ChartRequest";
import {unwrap} from "@/utils/unwrap";
import {removeCookie} from "@/utils/cookie";

export async function getGARecentUsersTop(param: GARequest) {
    return unwrap(await fetchJWT(`/api/dashboard/real-time-top?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: { tags: ['gaRecentUsersTop'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getGARecentUsersBottom(param: GARequest) {
    return unwrap(await fetchJWT(`/api/dashboard/real-time-bottom?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: { tags: ['gaRecentUsersBottom'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getGoogleAnalytics(param: GARequest) {
    return unwrap(await fetchJWT(`/api/dashboard/traffic?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: { tags: ['ga'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getGoogleAnalyticsTop(param: GARequest) {
    return unwrap(await fetchJWT(`/api/dashboard/trafficTop?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: { tags: ['gaTop'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getGoogleAnalyticsMiddle(param: GARequest) {
    return unwrap(await fetchJWT(`/api/dashboard/trafficMiddle?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: { tags: ['gaMiddle'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getGoogleAnalyticsBottom(param: GARequest) {
    return unwrap(await fetchJWT(`/api/dashboard/trafficBottom?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: { tags: ['gaBottom'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getSalesByCountry(param: TopCustomerRequest) {
    return unwrap(await fetchJWT(`/api/dashboard/salesByCountry?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}`, {
        method: "GET",
        next: { tags: ['countries'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getSalesCards(param: ChartRequest) {
    return unwrap(await fetchJWT(`/api/dashboard/salesOverviewCard?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&filter=${param.filter}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&context=${param.context}`, {
        method: "GET",
        next: { tags: ['salesCards'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getSalesCharts(param: ChartRequest) {
    return unwrap(await fetchJWT(`/api/dashboard/salesOverviewChart?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&filter=${param.filter}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&context=${param.context}`, {
        method: "GET",
        next: { tags: ['salesCharts'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getTopCustomers(param: TopCustomerRequest) {
    return unwrap(await fetchJWT(`/api/dashboard/salesCustomers?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}`, {
        method: "GET",
        next: { tags: ['customers'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

export async function getTopProducts(param: TopCustomerRequest) {
    return unwrap(await fetchJWT(`/api/dashboard/salesProducts?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}`, {
        method: "GET",
        next: { tags: ['products'] },
        credentials: 'include',
        cache: 'no-store',
    }));
}

