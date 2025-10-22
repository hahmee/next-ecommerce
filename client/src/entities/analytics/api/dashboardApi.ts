// src/entities/analytics/api/dashboardApi.ts

﻿// src/entities/analytics/api/dashboardApi.ts

import type { ChartRequest } from '@/entities/analytics/model/ChartRequest';
import type { GARequest } from '@/entities/analytics/model/GARequest';
import type { TopCustomerRequest } from '@/entities/analytics/model/TopCustomerRequest';
import { fetcher } from '@/shared/http/fetcher';
import buildSearchParams from '@/shared/lib/buildSearchParams';

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export type QueryInit = Record<string, string | number | boolean | undefined | null>;

export function qs(obj: QueryInit) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    p.append(k, String(v));
  }
  return p.toString();
}

export const dashboardApi = {
  // --- Real-time ---
  gaRecentUsersTop: (p: GARequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/real-time-top?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        filter: String(p.filter),
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  gaRecentUsersBottom: (p: GARequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/real-time-bottom?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        filter: String(p.filter),
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  // --- Traffic ---
  googleAnalytics: (p: GARequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/traffic?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        filter: String(p.filter),
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  googleAnalyticsTop: (p: GARequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/trafficTop?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        filter: String(p.filter),
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  googleAnalyticsMiddle: (p: GARequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/trafficMiddle?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        filter: String(p.filter),
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  googleAnalyticsBottom: (p: GARequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/trafficBottom?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        filter: String(p.filter),
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  // --- Sales ---
  salesByCountry: (p: TopCustomerRequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/salesByCountry?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  salesCards: (p: ChartRequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/salesOverviewCard?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        filter: String(p.filter),
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        context: p.context,
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  salesCharts: (p: ChartRequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/salesOverviewChart?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
        filter: String(p.filter),
        comparedStartDate: p.comparedStartDate,
        comparedEndDate: p.comparedEndDate,
        context: p.context,
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  topCustomers: (p: TopCustomerRequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/salesCustomers?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  topProducts: (p: TopCustomerRequest, init?: FetchOpts) =>
    fetcher(
      `/api/dashboard/salesProducts?${qs({
        startDate: p.startDate,
        endDate: p.endDate,
      })}`,
      { method: 'GET', ...(init ?? {}) },
    ),

  recentUsersTop: (
    params: {
      startDate: string;
      endDate: string;
      comparedStartDate: string;
      comparedEndDate: string;
      filter: string | number;
    },
    init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
  ) => {
    const qs = buildSearchParams(params);
    return fetcher(`/api/dashboard/real-time-top?${qs.toString()}`, {
      method: 'GET',
      ...(init ?? {}),
    });
  },

  recentUsersBottom: (
    params: {
      startDate: string;
      endDate: string;
      comparedStartDate: string;
      comparedEndDate: string;
      filter: string | number;
    },
    init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
  ) => {
    const qs = buildSearchParams(params);
    return fetcher(`/api/dashboard/real-time-bottom?${qs.toString()}`, {
      method: 'GET',
      ...(init ?? {}),
    });
  },
};
