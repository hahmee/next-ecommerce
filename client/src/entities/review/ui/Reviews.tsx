import React from 'react';

import { Review } from '@/entities/review/model/types';
import ReviewSingle from '@/entities/review/ui/ReviewSingle';

const Reviews = ({ reviews }: { reviews: Array<Review> | undefined }) => {
  return reviews?.map((review: Review, index: number) => (
    <ReviewSingle key={index} review={review} />
  ));
};

export default Reviews;
