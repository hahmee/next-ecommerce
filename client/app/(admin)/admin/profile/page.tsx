// app/(admin)/admin/profile/page.tsx

import type { Metadata } from 'next';

import { authApi } from '@/entities/member/api/authApi';
import { ProfilePage } from '@/pages/admin/profile';

export async function generateMetadata(): Promise<Metadata> {
  const user = await authApi.me({ cache: 'no-store' }).catch(() => null);
  const nickname = user?.nickname ?? '사용자';
  const email = user?.email ?? '';

  return {
    title: `${nickname} (${email})`,
    description: `${nickname}님의 프로필 페이지입니다.`,
    openGraph: {
      title: `${nickname}님의 프로필`,
      description: `${email} 프로필 정보`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/profile`,
    },
    twitter: {
      card: 'summary',
      title: `${nickname}님의 프로필`,
      description: `${email}의 계정 정보`,
    },
  };
}

export default function Page() {
  return <ProfilePage />;
}
