// src/widgets/home/profile/ui/UserReviews.tsx

'use client';

import { useMyReviews } from '@/features/review/read/model/useMyReviews';
import { UserReviewsView } from '@/widgets/home/profile/ui/UserReviewsView';

export default function UserReviews() {
  const reviews = useMyReviews();
  return <UserReviewsView {...reviews} />;
}
