// src/pages/admin/users/ui/users-page.tsx



import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { memberApi } from '@/entities/member/api/memberApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import UserDashboard from '@/widgets/admin/users/ui/UserDashboard';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

const UserDashboardPage = () => {
  const prefetchOptions = {
    queryKey: ['members', { page: 1, size: 10, search: '' }],
    queryFn: () => memberApi.listAdmin({ page: 1, size: 10, search: '' }),
  };

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Users" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<Loading />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <UserDashboard />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
};

export default UserDashboardPage;
