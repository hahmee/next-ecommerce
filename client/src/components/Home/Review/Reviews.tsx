import React from 'react';
import { Review } from '@/interface/Review';
import ReviewSingle from '@/components/Home/Review/ReviewSingle';

const Reviews = ({ reviews }: { reviews: Array<Review> | undefined }) => {
  return reviews?.map((review: Review, index: number) => (
    <ReviewSingle key={index} review={review} />
  ));
};

export default Reviews;
