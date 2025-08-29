import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import Profile from '@/components/Admin/Profile/Profile';
import { getUserProfile } from '@/apis/mallAPI';
import Loading from '@/app/loading';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import { cookies } from 'next/headers';
import { getUserInfo } from '@/libs/auth';

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
export default async function ProfilePage() {
  const prefetchOptions = {
    queryKey: ['user'],
    queryFn: () => getUserProfile(),
  };

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Profile" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<Loading />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <ErrorHandlingWrapper>
              <Profile />
            </ErrorHandlingWrapper>
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
