"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import {useQuery} from "@tanstack/react-query";
import {getGARecentUsersBottom} from "@/apis/dashbaordAPI";
import {GARealTimeResponseBottom} from "@/interface/GARealTimeResponse";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import LoadingSkeleton from "@/components/Skeleton/LoadingSkeleton";
import dayjs from "dayjs";

const RecentVisitors = dynamic(() => import("./Charts/RecentVisitors"), { ssr: false });
const PieChart = dynamic(() => import("./Charts/PieChart"), { ssr: false });

const RealtimeBottomOverview: React.FC = () => {

  const today = dayjs(); // 오늘
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
    data: gaBottomData,
    isLoading,
    isFetching
  } = useQuery<GARealTimeResponseBottom, Object, GARealTimeResponseBottom>({
    queryKey: ['gaRecentUsersBottom', date, currentFilter],
    queryFn: () => getGARecentUsersBottom({
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

  if(isLoading || isFetching) {
    return <LoadingSkeleton/>;
  }

  return (
      <>
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-6 md:gap-6 2xl:gap-7.5">
            <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full min-h-[400px]">
              <RecentVisitors gaData={gaBottomData?.recentVisitors}/>
            </LazyLoadWrapper>
          </div>

          <div className="col-span-12 xl:col-span-6 md:gap-6 2xl:gap-7.5">
            <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full min-h-[400px]">
              <PieChart data={gaBottomData?.devices} title={"Users by device"} label="Active users"/>
            </LazyLoadWrapper>
          </div>

        </div>

      </>
  );
};

export default RealtimeBottomOverview;
