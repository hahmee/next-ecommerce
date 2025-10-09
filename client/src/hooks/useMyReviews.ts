'use client';

import { useQuery } from '@tanstack/react-query';
import type { Review } from '@/interface/Review';
import { reviewApi } from '@/libs/services/reviewApi';

export function useMyReviews() {
  const query = useQuery<Review[], Error>({
    queryKey: ['myReviews'],
    queryFn: () => reviewApi.myReviews(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });

  return {
    myReviews: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
