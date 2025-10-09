'use client';

import { useMyReviews } from '@/hooks/useMyReviews';
import { UserReviewsView } from './UserReviewsView';

export default function UserReviews() {
  const reviews = useMyReviews();
  return <UserReviewsView {...reviews} />;
}
