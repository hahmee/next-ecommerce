import React from 'react';

import { Review } from '@/entities/review';
import { ReviewSingle } from '@/entities/review';

export const Reviews = ({ reviews }: { reviews: Array<Review> | undefined }) => {
  return reviews?.map((review: Review, index: number) => (
    <ReviewSingle key={index} review={review} />
  ));
};
