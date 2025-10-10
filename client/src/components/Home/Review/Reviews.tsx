import React from 'react';

import ReviewSingle from '@/components/Home/Review/ReviewSingle';
import { Review } from '@/interface/Review';

const Reviews = ({ reviews }: { reviews: Array<Review> | undefined }) => {
  return reviews?.map((review: Review, index: number) => (
    <ReviewSingle key={index} review={review} />
  ));
};

export default Reviews;
