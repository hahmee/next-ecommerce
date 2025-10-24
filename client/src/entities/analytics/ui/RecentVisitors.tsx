import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { SessionDTO } from '@/entities/analytics';

export const RecentVisitors = ({ gaData }: { gaData: Array<SessionDTO<number>> | undefined }) => {
  return (
    <div className="h-full col-span-2 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-1">
      <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
        <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
          Recent visitors
        </h5>
      </div>

      <div className="w-full space-y-2 flex flex-col px-4.5 pt-4.5 pb-2.5">
        {gaData?.map((visitor) => (
          <div key={visitor.key} className="grid grid-rows-2 grid-cols-2 gap-2">
            <div className="row-span-1 text-sm font-semibold flex gap-2 ">
              <ComputerDesktopIcon className="h-5 w-5 text-gray-500" />
              <span> Visitor # {visitor.key || '(알 수 없음)'}</span>
              <span className={` z-1 h-3.5 w-3.5 rounded-full bg-meta-3 inline`}>
                <span className="-z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-3 opacity-75" />
              </span>
            </div>
            <div className="text-sm font-bold row-span-1 text-right">
              {' '}
              {Number(visitor.value).toLocaleString()}
            </div>
            <div className="col-span-2 font-semibold text-xs text-gray-500">Browsing</div>
          </div>
        ))}
      </div>
    </div>
  );
};
