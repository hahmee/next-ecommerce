import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import Profile from '@/components/Admin/Profile/Profile';
import Loading from '@/app/loading';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import type { Metadata } from 'next';
import {authApi} from "@/libs/services/authApi";
import {profileApi} from "@/libs/services/profileApi";


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

export default async function ProfilePage() {
  const prefetchOptions = {
    queryKey: ['user'],
    queryFn: () => profileApi.get(),
  } as const;

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
