'use client';

import { useMyReviews } from '@/features/review/add/model/useMyReviews';

import { UserReviewsView } from './UserReviewsView';

export default function UserReviews() {
  const reviews = useMyReviews();
  return <UserReviewsView {...reviews} />;
}
