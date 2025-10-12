'use client';

import { useQuery } from '@tanstack/react-query';

import { Member } from '@/entities/member/model/Member';
import { profileApi } from '@/entities/member/model/profileApi';

export function useProfile() {
  const query = useQuery<Member>({
    queryKey: ['user'],
    queryFn: () => profileApi.get(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  return {
    member: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
