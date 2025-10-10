'use client';

import { useMyReviews } from '@/hooks/home/review/useMyReviews';

import { UserReviewsView } from './UserReviewsView';

export default function UserReviews() {
  const reviews = useMyReviews();
  return <UserReviewsView {...reviews} />;
}
