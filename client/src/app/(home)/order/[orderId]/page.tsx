import React, { Suspense } from 'react';

import OrderDetail from '@/widgets/home/profile/ui/OrderDetail';
import OrderDetailSkeleton from '@/entities/common/ui/Skeletons/OrderDetailSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { authApi } from '@/entities/member/model/authService';
import { orderApi } from '@/entities/order/model/service';

interface Props {
  params: { orderId: string };
}

export async function generateMetadata({ params }: Props) {
  const { orderId } = params;

  const user = await authApi.me({ cache: 'no-store' }).catch(() => null);
  const nickname = user?.nickname ?? '회원';
  const email = user?.email ?? 'unknown@example.com';

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
      queryFn: () => orderApi.listByOrderId(orderId),
    },
  ];

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <OrderDetail orderId={orderId} />
      </PrefetchBoundary>
    </Suspense>
  );
}
