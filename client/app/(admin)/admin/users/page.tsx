import React, {Suspense} from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Loading from '@/app/loading';
import {PrefetchBoundary} from '@/libs/PrefetchBoundary';
import UserDashbaord from '@/components/Admin/Users/UserDashbaord';
import {memberApi} from "@/libs/services/memberApi";


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
