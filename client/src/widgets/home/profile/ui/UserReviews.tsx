'use client';

import { useMyReviews } from '@/features/review/read';
import { UserReviewsView } from '@/widgets/home/profile';

export function UserReviews() {
  const reviews = useMyReviews();
  return <UserReviewsView {...reviews} />;
}
