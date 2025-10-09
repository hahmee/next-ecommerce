'use client';

import { StarIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/interface/Product';
import Link from 'next/link';
import { ColorTag } from '@/interface/ColorTag';
import { CartItem } from '@/interface/CartItem';
import { useCartStore } from '@/store/cartStore';
import { SalesStatus } from '@/types/salesStatus';
import Skeleton from '@/components/Skeleton/Skeleton';
import React, { useEffect, useState } from 'react';
import { getPublicFeaturedProducts, getPublicNewProducts } from '@/apis/publicAPI';
import { useUserStore } from '@/store/userStore';
import { useChangeCartMutation } from '@/hooks/useChangeCartMutation';
import FallbackImage from '@/components/Common/FallbackImage';

const MainProductList = ({ type }: { type: 'new' | 'featured' }) => {
  const { carts, changeOpen, isLoading } = useCartStore();
  const [data, setData] = useState<Product[] | undefined>(undefined);
  const { user } = useUserStore();
  const { mutate: changeCart } = useChangeCartMutation();

  const { data: newProducts } = useQuery<Array<Product>, Object, Array<Product>>({
    queryKey: ['new-products'],
    queryFn: () => getPublicNewProducts(),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: false,
    enabled: type === 'new',
  });

  const { data: featuredProducts } = useQuery<Array<Product>, Object, Array<Product>>({
    queryKey: ['featured-products'],
    queryFn: () => getPublicFeaturedProducts(),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: false,
    enabled: type === 'featured',
  });

  useEffect(() => {
    if (type === 'featured') {
      setData(featuredProducts);
    } else {
      setData(newProducts);
    }
  }, [data]);

  const handleClickAddCart = (
    pno: number,
    sellerEmail: string,
    options: { color: ColorTag; size: string },
  ) => {
    changeOpen(true);

    const existing = carts.find(
      (item) => item.size === options.size && item.color.id === options.color.id,
    );

    const cartItem: CartItem = {
      email: user?.email || '',
      pno,
      qty: existing ? existing.qty + 1 : 1,
      color: options.color,
      size: options.size,
      sellerEmail,
    };

    changeCart(cartItem); // React Query 내부에서 fetcher 실행 + 상태 갱신
  };

  if (!newProducts || !featuredProducts) {
    return <Skeleton />;
  }

  return (
    <div className="mt-20 w-full m-auto flex justify-center">
      <div className="flex justify-center gap-x-4 gap-y-5 flex-wrap w-270">
        {data?.map((product: Product, index) => (
          <Link
            href={`/product/${product.pno}`}
            className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-60"
            key={product.pno}
          >
            <div>
              <div className="relative w-full h-65">
                {product.uploadFileNames && product.uploadFileNames.length > 0 && (
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
                )}
              </div>
              <div className="flex mt-1.5 flex-col items-center">
                {product.averageRating !== 0 ? (
                  <div className="flex gap-1 my-3">
                    {Array.from({ length: product.averageRating || 0 }).map((_, index) => (
                      <StarIcon key={index} className="w-4.5 h-4.5 text-ecom" />
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
                  disabled={!user || product.salesStatus != SalesStatus.ONSALE || isLoading}
                  className="mt-3 rounded-2xl ring-1 ring-ecom text-ecom w-max py-2 px-4 text-xs hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
                  onClick={(e) => {
                    e.preventDefault(); // 페이지 이동 방지
                    e.stopPropagation(); // 부모로의 이벤트 전파 방지
                    handleClickAddCart(product.pno, product.owner.email, {
                      color: product.colorList[0],
                      size: product.sizeList[0],
                    });
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
