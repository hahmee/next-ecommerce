'use client';

import { StarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import React from 'react';

import FallbackImage from '@/components/Common/FallbackImage';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useMainProductList } from '@/hooks/home/product/useMainProductList';
import type { Product } from '@/interface/Product';

const MainProductList = ({ type }: { type: 'new' | 'featured' }) => {
  const { products, isLoading, addToCart, isAddDisabled } = useMainProductList(type);

  if (isLoading) return <Skeleton />;

  return (
    <div className="mt-20 w-full m-auto flex justify-center">
      <div className="flex justify-center gap-x-4 gap-y-5 flex-wrap w-270">
        {products.map((product: Product, index) => (
          <Link
            href={`/product/${product.pno}`}
            className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-60"
            key={product.pno}
          >
            <div>
              <div className="relative w-full h-65">
                {product.uploadFileNames?.length ? (
                  <>
                    <FallbackImage
                      src={product.uploadFileNames[0]?.file}
                      fallbackSrc="/images/mall/product.png"
                      alt="product"
                      fill
                      index={index}
                      sizes="25vw"
                      className="absolute object-cover rounded-md hover:opacity-0 transition-opacity ease-in-out duration-500"
                    />
                    <FallbackImage
                      src={product.uploadFileNames[1]?.file}
                      fallbackSrc="/images/mall/product.png"
                      alt=""
                      fill
                      index={index}
                      sizes="25vw"
                      className="absolute object-cover rounded-md"
                    />
                  </>
                ) : (
                  <FallbackImage
                    src=""
                    fallbackSrc="/images/mall/product.png"
                    alt="product"
                    fill
                    index={index}
                    sizes="25vw"
                    className="absolute object-cover rounded-md"
                  />
                )}
              </div>

              <div className="flex mt-1.5 flex-col items-center">
                {product.averageRating ? (
                  <div className="flex gap-1 my-3">
                    {Array.from({ length: product.averageRating }).map((_, i) => (
                      <StarIcon key={i} className="w-4.5 h-4.5 text-ecom" />
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-1 my-3 text-xs text-gray-600">평점 없음</div>
                )}

                <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 text-sm">
                  {product.pname}
                </span>
                <span className="font-semibold text-gray-600">
                  {product.price?.toLocaleString()} 원
                </span>

                <button
                  disabled={isAddDisabled(product)}
                  className="mt-3 rounded-2xl ring-1 ring-ecom text-ecom w-max py-2 px-4 text-xs hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainProductList;
