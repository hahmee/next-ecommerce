'use client';

import { useQuery } from '@tanstack/react-query';

import type { Member } from '@/interface/Member';
import type { PageResponse } from '@/interface/PageResponse';
import { type ListArgs, memberApi } from '@/libs/services/memberApi';

export function useAdminMembers(params: ListArgs) {
  return useQuery<PageResponse<Member>>({
    queryKey: ['adminMembers', params],
    queryFn: () => memberApi.listAdmin(params),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
