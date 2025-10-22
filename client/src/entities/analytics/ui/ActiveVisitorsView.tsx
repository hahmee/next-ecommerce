// src/entities/analytics/ui/ActiveVisitorsView.tsx

﻿// src/entities/analytics/ui/ActiveVisitorsView.tsx

import React from 'react';

import { SessionDTO } from '@/entities/analytics/model/GAResponse';

const ActiveVisitorsView = ({ gaData }: { gaData: Array<SessionDTO<number>> | undefined }) => {
  return (
    <div className="h-full col-span-2 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-1">
      <div className="justify-between grid grid-cols-2 row-span-2 ">
        <div className="underline text-xs px-4.5 pt-4.5 font-semibold text-gray-600 dark:text-white">
          지난 30분동안의 활성 사용자
        </div>
        <div className="underline text-xs px-4.5 pt-4.5 font-semibold text-gray-600 dark:text-white">
          지난 30분 동안의 조회수
        </div>
        <div className="text-2xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
          {gaData?.find((g) => g.key === 'activeUsers')?.value.toLocaleString() || 0}
        </div>
        <div className="text-2xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
          {gaData?.find((g) => g.key === 'pageViews')?.value.toLocaleString() || 0}
        </div>
      </div>
    </div>
  );
};

export default ActiveVisitorsView;
