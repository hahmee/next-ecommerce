// src/features/review/read/model/useMyReviews.ts

﻿// src/features/review/read/model/useMyReviews.ts



'use client';

import { useQuery } from '@tanstack/react-query';

import { reviewApi } from '@/entities/review/api/reviewApi';
import type { Review } from '@/entities/review/model/types';

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
