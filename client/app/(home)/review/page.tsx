// app/(home)/review/page.tsx

import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { authApi } from '@/entities/member/api/authApi';
import { ReviewHistoryPage } from '@/pages/home/review';

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

export default function Page() {
  return <ReviewHistoryPage />;
}
