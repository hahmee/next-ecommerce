// src/pages/home/review/ui/review-page.tsx

﻿// src/pages/(home)/review/index.tsx

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { authApi } from '@/entities/member/api/authApi';
import { reviewApi } from '@/entities/review/api/reviewApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import UserReviews from '@/widgets/home/profile/ui/UserReviews';

// 메타는 그대로 두되, 필요시 간소화 가능
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refresToken = cookieStore.get('refresh_token')?.value;

  let nickname = '사용자';
  let email = '';

  if (accessToken && refresToken) {
    try {
      const user = await authApi.me().catch(() => null);
      nickname = user?.nickname || nickname;
      email = user?.email || email;
    } catch (e) {
      console.warn('사용자 정보를 불러오지 못했습니다.', e);
    }
  }

  return {
    title: `${nickname}님의 리뷰 기록`,
    description: `${nickname} (${email})님의 상품 리뷰 목록입니다.`,
    openGraph: {
      title: `${nickname}님의 리뷰 내역`,
      description: `${email}님의 작성한 모든 상품 리뷰`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/review`,
    },
    twitter: {
      card: 'summary',
      title: `${nickname}님의 리뷰 내역`,
      description: `${email}님의 작성 리뷰`,
    },
  };
}

export default async function ReviewHistoryPage() {
  const prefetchOptions = [
    {
      queryKey: ['myReviews'],
      queryFn: () => reviewApi.myReviews(),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <div className="container mx-auto px-4 py-8 ">
          <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <UserReviews />
          </div>
        </div>
      </PrefetchBoundary>
    </Suspense>
  );
}
