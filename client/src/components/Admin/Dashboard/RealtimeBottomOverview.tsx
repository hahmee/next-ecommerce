"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import {useQuery} from "@tanstack/react-query";
import {getCookie} from "cookies-next";
import {getGARecentUsersBottom} from "@/apis/dashbaordAPI";
import {GARealTimeResponseBottom} from "@/interface/GARealTimeResponse";
import formatDate from "@/libs/formatDate";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import LoadingSkeleton from "@/components/Skeleton/LoadingSkeleton";

const RecentVisitors = dynamic(() => import("./Charts/RecentVisitors"), { ssr: false });
const PieChart = dynamic(() => import("./Charts/PieChart"), { ssr: false });

const RealtimeBottomOverview: React.FC = () => {

  const endDate = new Date(); // today
  const startDate = new Date();  // today

  startDate.setDate(endDate.getDate() - 30); // 30 days ago
  // 새로운 날짜 계산
  const comparedEndDate = new Date(startDate); // endDate 복사
  comparedEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

  const comparedStartDate = new Date(comparedEndDate); // newEndDate 복사
  comparedStartDate.setDate(comparedEndDate.getDate() - 30); // 차이만큼 날짜 빼기


  const [currentFilter, setCurrentFilter] = useState<ChartFilter>(ChartFilter.DAY);
  const memberInfo = getCookie('member');
  const member = memberInfo ? JSON.parse(memberInfo) : null;

  const [date, setDate] = useState({
    startDate: formatDate(startDate),
    endDate:formatDate(endDate)
  });

  const [comparedDate, setComparedDate] = useState({
    startDate: formatDate(comparedStartDate),
    endDate: formatDate(comparedEndDate),
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
      sellerEmail: member.email,
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
