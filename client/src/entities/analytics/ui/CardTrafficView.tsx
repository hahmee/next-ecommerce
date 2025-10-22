// src/entities/analytics/ui/CardTrafficView.tsx

﻿// src/entities/analytics/ui/CardTrafficView.tsx

import React from 'react';

import { GAResponseTop } from '@/entities/analytics/model/GAResponse';

const CardTrafficView = ({ gaData }: { gaData: GAResponseTop | undefined }) => {
  return (
    <div className="grid grid-cols-3 divide-x mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark bg-white">
      <div className="pr-7.5">
        <CardItemTraffic
          title="Site sessions"
          value={gaData?.sessions}
          comparedValue={gaData?.sessionsCompared}
        />
      </div>
      <div className="pr-7.5 pl-7.5">
        <CardItemTraffic
          title="Unique visitors"
          value={gaData?.uniqueVisitors}
          comparedValue={gaData?.uniqueVisitorsCompared}
        />
      </div>
      <div className="pl-7.5">
        <CardItemTraffic
          title="Avg. session duration"
          value={gaData?.avgSessionDuration}
          comparedValue={gaData?.avgSessionDurationCompared}
        />
      </div>
    </div>
  );
};

export default React.memo(CardTrafficView);

export const CardItemTraffic = ({
  title,
  value,
  comparedValue,
}: {
  title: string;
  value: string | undefined;
  comparedValue: string | undefined;
}) => {
  const level: boolean = comparedValue == '-' || Number(comparedValue) >= 0;

  return (
    <>
      <div className="font-light text-sm">{title}</div>
      <div className="flex items-center justify-between">
        <div className="font-bold">{Number(value).toLocaleString()}</div>
        <div className="flex items-center">
          <span
            className={`flex items-center gap-1 text-sm font-medium ${level && 'text-meta-3'} ${!level && 'text-meta-5'} `}
          >
            {comparedValue}%
            {level ? (
              <svg
                className="fill-meta-3"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
            ) : (
              <svg
                className="fill-meta-5"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                  fill=""
                />
              </svg>
            )}
          </span>
        </div>
      </div>
    </>
  );
};
