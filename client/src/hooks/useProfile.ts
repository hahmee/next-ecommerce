'use client';

import { profileApi } from '@/libs/services/profileApi';
import { useQuery } from '@tanstack/react-query';
import {Member} from "@/interface/Member";


export function useProfile() {
  const query = useQuery<Member>({
    queryKey: ['user'],
    queryFn: () => profileApi.get(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });

  return {
    member: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
