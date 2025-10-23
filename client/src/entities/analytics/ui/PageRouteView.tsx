import React from 'react';

import { SessionDTO } from '@/entities/analytics/model/GAResponse';

export const PageRouteView = ({ gaData }: { gaData: Array<SessionDTO<number>> | undefined }) => {
  return (
    <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
        <p className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
          이벤트 이름 별 이벤트 수
        </p>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>이벤트 이름</div>
          <div>이벤트 수</div>
        </div>
        {gaData?.map((data, index) => (
          <div
            key={data.key}
            className=" border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between"
          >
            <div>{index + 1}</div>
            <div>{data.key}</div>
            <div>{data.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
