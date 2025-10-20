// src/entities/review/ui/ReviewSingle.tsx

import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React from 'react';

import { Review } from '@/entities/review/model/types';

const ReviewSingle = ({ review }: { review: Review }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* USER */}
      <div className="flex items-center gap-4 font-medium">
        <Image
          src="/images/admin/user-01.png"
          alt="유저_이미지"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>{review.owner?.nickname}</span>
      </div>
      {/* STARS */}
      <div className="flex gap-1">
        {Array.from({ length: review.rating }).map((_, index) => (
          <StarIcon key={index} className="w-5 h-5 text-ecom" />
        ))}
      </div>
      {/* DESC */}
      <p>{review.content}</p>
    </div>
  );
};
export default ReviewSingle;
