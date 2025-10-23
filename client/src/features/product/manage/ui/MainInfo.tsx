'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export const MainInfo = () => {
  const router = useRouter();

  return (
    <div className="relative bg-[#F9F9F9] mt-50 flex justify-center px-10 overflow-visible h-[calc(100vh-300px)] ">
      {/* 왼쪽: 이미지 */}
      <div className="flex-1 h-full relative">
        {/* absolute로 배치하고, transform으로 위로 이동 */}
        <div className="absolute right-5 bottom-0">
          <Image
            src="/images/mall/main_kid.png"
            alt="kid"
            width={400}
            height={400}
            priority
            className="w-full h-[400px] object-cover object-bottom rounded-lg"
          />
        </div>
      </div>

      {/* 오른쪽: 텍스트 */}
      <div className="flex-1 flex flex-col justify-center pl-10 ">
        <div className="font-extrabold text-6xl text-gray-900 mb-6">
          Special offer <br /> in kids products
        </div>
        <div className="font-normal text-lg text-gray-500 mb-10">
          Fashion is a form of self-expression and autonomy at a <br />
          particular period and place.
        </div>
        <button
          className="mt-10 w-40 h-12 text-xl font-medium rounded-3xl ring-1 ring-ecom text-white py-2 px-4 bg-ecom hover:bg-ecomHigh hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
          onClick={() => router.push('/list?category_id=1')}
        >
          Discover me
        </button>
      </div>
    </div>
  );
};

