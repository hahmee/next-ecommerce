import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import UserDashbaord from '@/components/Admin/Users/UserDashbaord';
import Breadcrumb from '@/widgets/common/ui/Breadcrumb';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { memberApi } from '@/entities/member/model/memberApi';

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
            <UserDashbaord />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
};

export default UserDashboardPage;
