"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import {useQuery} from "@tanstack/react-query";
import {getGARecentUsersTop} from "@/apis/dashbaordAPI";
import {GARealTimeResponseTop} from "@/interface/GARealTimeResponse";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import dayjs from "dayjs";

const ActiveVisitors = dynamic(() => import("./Charts/ActiveVisitors"), { ssr: false });
const ActiveVisitChart = dynamic(() => import("./Charts/ActiveVisitChart"), { ssr: false });
const PageRoute = dynamic(() => import("./Charts/PageRoute"), { ssr: false });
const RealtimeBottomOverview = dynamic(() => import("./RealtimeBottomOverview"), { ssr: false });

const RealtimeOverview: React.FC = () => {
  const today = dayjs();
  const end = today;
  const start = end.subtract(30, "day");

  const comparedEnd = start.subtract(1, "day");
  const comparedStart = comparedEnd.subtract(30, "day");

  const [currentFilter, setCurrentFilter] = useState<ChartFilter>(ChartFilter.DAY);

  const [date, setDate] = useState({
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
  });

  const [comparedDate, setComparedDate] = useState({
    startDate: comparedStart.format("YYYY-MM-DD"),
    endDate: comparedEnd.format("YYYY-MM-DD"),
  });

  const {
    data: gaTopData,
    isLoading,
    isFetching,
  } = useQuery<GARealTimeResponseTop, Object, GARealTimeResponseTop>({
    queryKey: ['gaRecentUsersTop', date, currentFilter],
    queryFn: () => getGARecentUsersTop({
      startDate: date.startDate,
      endDate: date.endDate,
      filter: currentFilter,
      comparedStartDate: comparedDate.startDate,
      comparedEndDate: comparedDate.endDate,
    }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
  });

  return (
      <>
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12 grid grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
            <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full">
              <ActiveVisitors gaData={gaTopData?.activeVisitors}/>
            </LazyLoadWrapper>
            <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full">
              <ActiveVisitChart chart={gaTopData?.activeVisitChart}/>
            </LazyLoadWrapper>
          </div>
          <div className="col-span-12">
            <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full">
              <PageRoute gaData={gaTopData?.events}/>
            </LazyLoadWrapper>
          </div>

          <div className="col-span-12">
            <LazyLoadWrapper fallback={<div>Loading additional data...</div>}>
              <RealtimeBottomOverview/>
            </LazyLoadWrapper>
          </div>

        </div>

      </>
  );
};

export default RealtimeOverview;
