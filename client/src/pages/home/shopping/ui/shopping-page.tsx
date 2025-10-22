// src/pages/home/shopping/ui/shopping-page.tsx

﻿// src/pages/(home)/shopping/index.tsx

import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import { authApi } from '@/entities/member/api/authApi';
import { paymentApi } from '@/entities/payment/api/paymentApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ShoppingSkeleton from '@/shared/ui/skeletons/ShoppingSkeleton';
import UserOrders from '@/widgets/home/profile/ui/UserOrders';

export async function generateMetadata(): Promise<Metadata> {
  const user = await authApi.me({ cache: 'no-store' }).catch(() => null);
  const nickname = user?.nickname ?? '사용자';
  const email = user?.email ?? '';

  return {
    title: `${nickname}님의 주문 내역`,
    description: `${nickname} (${email})님의 과거 주문 및 결제 내역을 확인할 수 있는 페이지입니다.`,
    openGraph: {
      title: `${nickname}님의 주문 내역`,
      description: `${email}님의 주문 기록`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/shopping`,
    },
    twitter: {
      card: 'summary',
      title: `${nickname}님의 주문 기록`,
      description: `주문 및 결제 이력을 확인해보세요.`,
    },
  };
}

export default async function OrderHistoryPage() {
  const prefetchOptions = [
    {
      queryKey: ['payments'],
      queryFn: () => paymentApi.list(),
    },
  ];

  return (
    <Suspense fallback={<ShoppingSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <div className="container mx-auto px-4 py-8 ">
          <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <UserOrders />
          </div>
        </div>
      </PrefetchBoundary>
    </Suspense>
  );
}
