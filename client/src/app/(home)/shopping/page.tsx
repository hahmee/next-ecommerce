import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import UserOrders from '@/components/Home/Profile/UserOrders';
import { getPayments } from '@/apis/mallAPI';
import ShoppingSkeleton from '@/components/Skeleton/ShoppingSkeleton';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import { cookies } from 'next/headers';
import { getUserInfo } from '@/libs/auth';

// <head> 메타태그 정보(title, description 등) 를 설정하는 함수
export async function generateMetadata() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refresToken = cookieStore.get('refresh_token')?.value;

  let nickname = '사용자';
  let email = '';

  if (accessToken && refresToken) {
    try {
      const user = await getUserInfo();
      nickname = user.nickname || nickname;
      email = user.email || email;
    } catch (e) {
      console.warn('사용자 정보를 불러오지 못했습니다.', e);
    }
  }

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
      queryFn: () => getPayments({ queryKey: ['payments'] }),
    },
  ];

  return (
    <Suspense fallback={<ShoppingSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ErrorHandlingWrapper>
          <div className="container mx-auto px-4 py-8 ">
            <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
              <UserOrders />
            </div>
          </div>
        </ErrorHandlingWrapper>
      </PrefetchBoundary>
    </Suspense>
  );
}
