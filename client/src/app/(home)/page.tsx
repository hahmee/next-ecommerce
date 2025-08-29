import Slider from '@/components/Home/Slider';
import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import Skeleton from '@/components/Skeleton/Skeleton';
import {
  getPublicCategories,
  getPublicExpertProducts,
  getPublicFeaturedProducts,
  getPublicNewProducts,
} from '@/apis/publicAPI';
import Home from '@/components/Home/Main/Home';

// 동적 데이터 없음 -> generateMetadata대신 meatadata 사용
export const metadata = {
  title: 'Next E-commerce - 최신 트렌드 쇼핑몰',
  description:
    '가장 인기 있는 상품을 전문가 추천으로 한눈에! 지금 최신 상품과 할인 혜택을 확인해보세요.',
  openGraph: {
    title: 'Next E-commerce - 트렌디한 온라인 쇼핑',
    description: '지금 가장 주목받는 카테고리와 상품을 확인해보세요.',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    type: 'website',
    images: [
      {
        url: `https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg`, // 썸네일
        width: 1200,
        height: 630,
        alt: 'Next E-commerce 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next E-commerce',
    description: '인기 상품과 전문가 추천 제품을 한눈에!',
    images: [`https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg`],
  },
};

const HomePage = () => {
  const prefetchOptions = [
    {
      queryKey: ['categories'],
      queryFn: () => getPublicCategories(),
    },
    {
      queryKey: ['expert-products'],
      queryFn: () => getPublicExpertProducts(),
    },
    {
      queryKey: ['new-products'],
      queryFn: () => getPublicNewProducts(),
    },
    {
      queryKey: ['featured-products'],
      queryFn: () => getPublicFeaturedProducts(),
    },
  ];

  return (
    <div>
      <Slider />
      <Suspense fallback={<Skeleton />}>
        <PrefetchBoundary prefetchOptions={prefetchOptions}>
          <Home />
        </PrefetchBoundary>
      </Suspense>
    </div>
  );
};

export default HomePage;
