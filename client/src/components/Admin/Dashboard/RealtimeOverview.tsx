"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import {DataResponse} from "@/interface/DataResponse";
import {useQuery} from "@tanstack/react-query";
import {getCookie} from "cookies-next";
import {getGARecentUsersTop} from "@/apis/dashbaordAPI";
import {GARealTimeResponseTop} from "@/interface/GARealTimeResponse";
import formatDate from "@/libs/formatDate";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";

const ActiveVisitors = dynamic(() => import("./Charts/ActiveVisitors"), { ssr: false });
const ActiveVisitChart = dynamic(() => import("./Charts/ActiveVisitChart"), { ssr: false });
const PageRoute = dynamic(() => import("./Charts/PageRoute"), { ssr: false });
const RealtimeBottomOverview = dynamic(() => import("./RealtimeBottomOverview"), { ssr: false });

const RealtimeOverview: React.FC = () => {

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
    endDate: formatDate(endDate),
  });

  const [comparedDate, setComparedDate] = useState({
    startDate: formatDate(comparedStartDate),
    endDate: formatDate(comparedEndDate),
  });

  const {
    data: gaTopData,
    isLoading,
    isFetching,
  } = useQuery<DataResponse<GARealTimeResponseTop>, Object, GARealTimeResponseTop>({
    queryKey: ['gaRecentUsersTop', date, currentFilter],
    queryFn: () => getGARecentUsersTop({
      startDate: date.startDate || "",
      endDate: date.endDate || "",
      sellerEmail: member.email,
      filter: currentFilter,
      comparedStartDate: comparedDate.startDate || "",
      comparedEndDate: comparedDate.endDate|| "",
    }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
    select: (data) => {
      // 데이터 가공 로직만 처리
      return data.data;
    }
  });

  if(isLoading || isFetching) {
    return <DashboardSkeleton/>;
  }

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
