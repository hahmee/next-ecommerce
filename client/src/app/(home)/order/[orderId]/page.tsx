import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import OrderDetail from '@/components/Home/Profile/OrderDetail';
import { getOrders } from '@/apis/mallAPI';
import OrderDetailSkeleton from '@/components/Skeleton/OrderDetailSkeleton';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import { cookies } from 'next/headers';
import { getUserInfo } from '@/libs/auth';

interface Props {
  params: { orderId: string };
}

export async function generateMetadata({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refresToken = cookieStore.get('refresh_token')?.value;

  const { orderId } = params;

  let nickname = '회원';
  let email = 'unknown@example.com';

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
    title: `${nickname}님의 주문 내역 #${orderId}`,
    description: `${nickname} (${email})님의 주문 상세 정보를 확인할 수 있는 페이지입니다.`,
    openGraph: {
      title: `${nickname}님의 주문 상세`,
      description: `${email}님의 주문 번호 #${orderId}`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${orderId}`,
    },
    twitter: {
      card: 'summary',
      title: `${nickname}님의 주문 상세`,
      description: `주문 번호 #${orderId}의 상세 내역`,
    },
  };
}
export default async function OrderPage({ params }: Props) {
  const { orderId } = params;

  const prefetchOptions = [
    {
      queryKey: ['orders', orderId],
      queryFn: () => getOrders({ orderId }), // getOrders() → accessToken 만료 → prefetch 실패
    },
  ];

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ErrorHandlingWrapper>
          <OrderDetail orderId={orderId} />
        </ErrorHandlingWrapper>
      </PrefetchBoundary>
    </Suspense>
  );
}
