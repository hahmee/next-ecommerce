// src/shared/ui/skeletons/ProductListSkeleton.tsx

﻿// src/shared/ui/skeletons/ProductListSkeleton.tsx

import { TableSkeleton } from '@/shared/ui/skeletons/TableSkeleton';

const PaymentSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-[auto,1fr] divide-y rounded-sm border shadow-default dark:border-strokedark dark:bg-boxdark bg-white">
        <div className="pl-7.5 py-3 col-span-2 font-semibold text-lg flex items-center relative">
          <div>개요:</div>

          <div className="z-99 absolute top-12 left-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" />
        </div>

        <div className="border-r flex flex-col gap-2 p-7.5">
          <div className="font-normal text-sm">총 금액</div>
          <div className="font-semibold text-base">
            {/* Skeleton for total amount */}
            <div className="w-36 h-6 bg-gray-300 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col gap-2 p-7.5">
          <div className="font-normal text-sm">결제 완료</div>
          <div className="font-semibold text-base">
            {/* Skeleton for completed payment count */}
            <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
      <div className="my-8" />

      <TableSkeleton />
    </div>
  );
};

export default PaymentSkeleton;
