'use client';

import { Product } from '@/interface/Product';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLongLeftIcon, ArrowLongRightIcon, StarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { getPublicExpertProducts } from '@/apis/publicAPI';

const ExpertList = () => {
  const { data: products } = useQuery<Array<Product>, Object, Array<Product>>({
    queryKey: ['expert-products'],
    queryFn: () => getPublicExpertProducts(),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: false,
  });

  // 현재 페이지 번호 (0부터 시작)
  const [page, setPage] = useState(0);

  // 한 페이지에 보여줄 아이템 수
  const itemsPerPage = 3;

  // 현재 페이지에 보여줄 제품들 계산
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products?.slice(startIndex, endIndex) || [];

  // 다음 페이지로 이동
  const handleNext = () => {
    if (products && endIndex < products.length) {
      setPage((prev) => prev + 1);
    }
  };

  // 이전 페이지로 이동
  const handlePrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="mt-24 px-4">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* 헤더 영역 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Chosen by our experts</h2>
            {/* 페이지 이동 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className="p-2 border-2 border-gray-200 rounded-full disabled:opacity-50 "
              >
                <ArrowLongLeftIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button
                onClick={handleNext}
                disabled={products && endIndex >= products.length}
                className="p-2 border-2 border-gray-200 rounded-full disabled:opacity-50"
              >
                <ArrowLongRightIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* 현재 페이지의 제품들만 보여줌 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentProducts.map((product) => {
              // 첫 번째 이미지는 메인 이미지
              const mainImage = product.uploadFileNames?.[0];
              // 나머지 3개는 서브 이미지
              const subImages = product.uploadFileNames?.slice(1, 4) || [];

              return (
                <Link href={`/product/${product.pno}`} key={product.pno}>
                  {/* 이미지 영역 */}
                  <div className="flex flex-col gap-2">
                    {/* 메인 이미지 */}
                    <div className="relative w-full h-48">
                      <Image
                        src={mainImage?.file || '/images/mall/no_image.png'}
                        alt={product.pname}
                        fill
                        sizes="100%"
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* 서브 이미지 */}
                    <div className="flex gap-2">
                      {subImages.map((src, idx) => (
                        <div key={idx} className="relative w-1/3 h-20 overflow-hidden rounded">
                          <Image
                            src={src.file}
                            alt={`${product.pname}-sub-${idx}`}
                            fill
                            sizes="100%"
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.pname}</h3>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span
                        className="w-10 h-5 rounded-lg"
                        style={{ backgroundColor: product.colorList[0].color }}
                      />
                      <span className="flex items-center">
                        <StarIcon className="w-4 h-4 text-ecom" /> {product.averageRating} (
                        {product.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="mt-2 text-green-600 font-semibold">
                      {product.price.toLocaleString()} 원
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertList;
