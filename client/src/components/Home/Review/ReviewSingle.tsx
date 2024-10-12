import Image from "next/image";
import {StarIcon} from "@heroicons/react/20/solid";
import React from "react";
import {Review} from "@/interface/Review";

const ReviewSingle = ({review}:{ review: Review;}) => {

    return <div className="flex flex-col gap-4">
        {/* USER */}
        <div className="flex items-center gap-4 font-medium">
            <Image
                src="https://via.placeholder.com/80"
                alt="유저_이미지"
                width={32}
                height={32}
                className="rounded-full"
            />
            <span>{review.owner?.nickname}</span>
        </div>
        {/* STARS */}
        <div className="flex gap-2">
            {Array.from({ length: review.rating }).map((_, index) => (
                <StarIcon key={index} className="w-5 h-5 text-yellow-400" />
            ))}
        </div>
        {/* DESC */}
        <p>{review.content}</p>
    </div>;

}
export default ReviewSingle;
