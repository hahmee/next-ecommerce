'use client';

import { useQuery } from '@tanstack/react-query';

import type { ListArgs, Member } from '@/entities/member';
import { memberApi } from '@/entities/member';
import type { PageResponse } from '@/entities/order';

export function useAdminMembers(params: ListArgs) {
  return useQuery<PageResponse<Member>>({
    queryKey: ['adminMembers', params],
    queryFn: () => memberApi.listAdmin(params),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
