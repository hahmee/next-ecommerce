'use client';

import { ArrowLongLeftIcon, ArrowLongRightIcon, StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { useExpertProducts } from 'src/features/product/create/model/useExpertProducts';

const ExpertList = () => {
  const { data: products = [] } = useExpertProducts();

  const [page, setPage] = useState(0);
  const itemsPerPage = 3;

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < products.length) setPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  return (
    <div className="mt-24 px-4">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Chosen by our experts</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className="p-2 border-2 border-gray-200 rounded-full disabled:opacity-50"
              >
                <ArrowLongLeftIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button
                onClick={handleNext}
                disabled={endIndex >= products.length}
                className="p-2 border-2 border-gray-200 rounded-full disabled:opacity-50"
              >
                <ArrowLongRightIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentProducts.map((product) => {
              const mainImage = product.uploadFileNames?.[0];
              const subImages = product.uploadFileNames?.slice(1, 4) ?? [];

              return (
                <Link href={`/product/${product.pno}`} key={product.pno}>
                  <div className="flex flex-col gap-2">
                    <div className="relative w-full h-48">
                      <Image
                        src={mainImage?.file || '/images/mall/no_image.png'}
                        alt={product.pname}
                        fill
                        sizes="100%"
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      {subImages.map((img, idx) => (
                        <div key={idx} className="relative w-1/3 h-20 overflow-hidden rounded">
                          <Image
                            src={img.file}
                            alt={`${product.pname}-sub-${idx}`}
                            fill
                            sizes="100%"
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.pname}</h3>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span
                        className="w-10 h-5 rounded-lg"
                        style={{ backgroundColor: product.colorList[0]?.color }}
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
