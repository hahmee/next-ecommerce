import {GARequest} from "@/interface/GARequest";
import {TopCustomerRequest} from "@/interface/TopCustomerRequest";
import {ChartRequest} from "@/interface/ChartRequest";
import {fetcher} from "@/utils/fetcher/fetcher";

export async function getGARecentUsersTop(param: GARequest) {
    return await fetcher(`/api/dashboard/real-time-top?startDate=${param.startDate}&endDate=${param.endDate}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getGARecentUsersBottom(param: GARequest) {
    return await fetcher(`/api/dashboard/real-time-bottom?startDate=${param.startDate}&endDate=${param.endDate}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getGoogleAnalytics(param: GARequest) {
    return await fetcher(`/api/dashboard/traffic?startDate=${param.startDate}&endDate=${param.endDate}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getGoogleAnalyticsTop(param: GARequest) {
    return await fetcher(`/api/dashboard/trafficTop?startDate=${param.startDate}&endDate=${param.endDate}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getGoogleAnalyticsMiddle(param: GARequest) {
    return await fetcher(`/api/dashboard/trafficMiddle?startDate=${param.startDate}&endDate=${param.endDate}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getGoogleAnalyticsBottom(param: GARequest) {
    return await fetcher(`/api/dashboard/trafficBottom?startDate=${param.startDate}&endDate=${param.endDate}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getSalesByCountry(param: TopCustomerRequest) {
    return await fetcher(`/api/dashboard/salesByCountry?startDate=${param.startDate}&endDate=${param.endDate}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getSalesCards(param: ChartRequest) {
    return await fetcher(`/api/dashboard/salesOverviewCard?startDate=${param.startDate}&endDate=${param.endDate}&filter=${param.filter}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&context=${param.context}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getSalesCharts(param: ChartRequest) {
    return await fetcher(`/api/dashboard/salesOverviewChart?startDate=${param.startDate}&endDate=${param.endDate}&filter=${param.filter}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&context=${param.context}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getTopCustomers(param: TopCustomerRequest) {
    return await fetcher(`/api/dashboard/salesCustomers?startDate=${param.startDate}&endDate=${param.endDate}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

export async function getTopProducts(param: TopCustomerRequest) {
    return await fetcher(`/api/dashboard/salesProducts?startDate=${param.startDate}&endDate=${param.endDate}`, {
        method: "GET",
        credentials: 'include',
        cache: 'no-store',
    })
}

