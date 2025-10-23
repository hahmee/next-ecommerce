// src/entities/analytics/ui/TrafficPageChartView.tsx

// src/entities/analytics/ui/TrafficPageChartView.tsx

import React from 'react';

import { SessionDTO } from '@/entities/analytics/model/GAResponse';
import HorizontalBarChart from '@/entities/analytics/ui/HorizontalBarChart';

const TrafficPageChartView = ({ topPages }: { topPages: Array<SessionDTO<number>> | [] }) => {
  const totalSessions = topPages ? topPages.reduce((acc, cur) => acc + Number(cur.value), 0) : 0;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
        <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
          Top pages by sessions
        </h5>
      </div>

      <div className="w-full space-y-2 flex flex-col px-4.5 pt-4.5 pb-2.5">
        {topPages.map((page) => (
          <div key={page.key}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-normal">
                {page.key === '/' ? 'Homepage' : page.key}
              </span>
              {/* <span className="text-sm font-bold">{Number(page.value).toLocaleString()}</span> */}
            </div>
            <HorizontalBarChart
              percentage={(page.value / totalSessions) * 100}
              count={page.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficPageChartView;
