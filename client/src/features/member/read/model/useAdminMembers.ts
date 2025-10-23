'use client';

import { useQuery } from '@tanstack/react-query';

import { memberApi } from '@/entities/member';
import type { Member } from '@/entities/member';
import type { PageResponse } from '@/entities/order';
import { ListArgs } from '@/entities/member/api/memberApi';

export function useAdminMembers(params: ListArgs) {
  return useQuery<PageResponse<Member>>({
    queryKey: ['adminMembers', params],
    queryFn: () => memberApi.listAdmin(params),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
