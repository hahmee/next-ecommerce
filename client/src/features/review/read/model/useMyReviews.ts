'use client';

import { useQuery } from '@tanstack/react-query';

import type { Review } from '@/entities/review/model/types';
import { reviewApi } from '@/entities/review/model/service';

export function useMyReviews() {
  const query = useQuery<Review[], Error>({
    queryKey: ['myReviews'],
    queryFn: () => reviewApi.myReviews(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  return {
    myReviews: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
