import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { profileApi } from '@/entities/member';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import Profile from '@/widgets/admin/users/ui/Profile';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export async function ProfilePage() {
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
            <Profile />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
