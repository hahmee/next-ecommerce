// app/(home)/order/[orderId]/page.tsx

import { OrderPage } from '@/pages/home/order';
import { authApi } from '@/entities/member/api/authApi';

interface Props { params: { orderId: string } };

export async function generateMetadata({ params }: Props) {
  const { orderId } = params;

  const user = await authApi.me({ cache: 'no-store' }).catch(() => null);
  const nickname = user?.nickname ?? '회원';
  const email = user?.email ?? 'unknown@example.com';

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${orderId}`;

  return {
    title: `${nickname}님의 주문 내역 #${orderId}`,
    description: `${nickname} (${email})님의 주문 상세 정보를 확인할 수 있는 페이지입니다.`,
    openGraph: {
      title: `${nickname}님의 주문 상세`,
      description: `${email}님의 주문 번호 #${orderId}`,
      url,
    },
    twitter: {
      card: 'summary',
      title: `${nickname}님의 주문 상세`,
      description: `주문 번호 #${orderId}의 상세 내역`,
    },
  };
}

export default function Page({ params }: Props) {
  return <OrderPage orderId={params.orderId} />;
}
