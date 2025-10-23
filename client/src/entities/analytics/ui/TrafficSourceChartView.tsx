// src/entities/analytics/ui/TrafficSourceChartView.tsx

// src/entities/analytics/ui/TrafficSourceChartView.tsx

import React from 'react';

import { SessionDTO } from '@/entities/analytics/model/GAResponse';
import HorizontalBarChart from '@/entities/analytics/ui/HorizontalBarChart';

const TrafficSourceChartView = ({ topSources }: { topSources: Array<SessionDTO<number>> | [] }) => {
  const totalSources = topSources ? topSources.reduce((acc, cur) => acc + Number(cur.value), 0) : 0;

  return (
    <div className="h-full rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
        <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
          Top traffic by sessions
        </h5>
      </div>

      <div className="w-full space-y-2 flex flex-col px-4.5 pt-4.5 pb-2.5">
        {topSources.map((source, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-normal">{source.key}</span>
              <span className="text-sm font-bold">{Number(source.value).toLocaleString()}</span>
            </div>
            <HorizontalBarChart
              percentage={(source.value / totalSources) * 100}
              count={source.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSourceChartView;
