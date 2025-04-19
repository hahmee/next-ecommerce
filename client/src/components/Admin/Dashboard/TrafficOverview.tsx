"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import AdminDatePicker from "@/components/Admin/Dashboard/AdminDatePicker";
import {getGoogleAnalyticsTop} from "@/apis/dashbaordAPI";
import {GAResponseTop} from "@/interface/GAResponse";
import {useQuery} from "@tanstack/react-query";
import {getCookie} from "cookies-next";
import formatDate from "@/libs/formatDate";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import {DateValueType} from "react-tailwindcss-datepicker/dist/types";

const CardTraffic = dynamic(() => import("./CardTraffic"), { ssr: false });
const TrafficSessionChart = dynamic(() => import("./Charts/TrafficSessionChart"), { ssr: false });
const MultiCirclesChart = dynamic(() => import("./Charts/MultiCirclesChart"), { ssr: false });
const TrafficMiddleOverview = dynamic(() => import("./TrafficMiddleOverview"), { ssr: false });
const TrafficBottomOverview = dynamic(() => import("./TrafficBottomOverview"), { ssr: false });

export type AdminDateType = {
  startDate: string;
  endDate: string;
};

const TrafficOverview: React.FC = () => {

  const endDate = new Date() ; // today
  const startDate = new Date();  // today

  startDate.setDate(endDate.getDate() - 31); // 31 days ago
  endDate.setDate(endDate.getDate() - 1); // 1 days ago

  // 새로운 날짜 계산
  const comparedEndDate = new Date(startDate); // endDate 복사
  comparedEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

  const comparedStartDate = new Date(comparedEndDate); // newEndDate 복사
  comparedStartDate.setDate(comparedEndDate.getDate() - 30); // 차이만큼 날짜 빼기

  const [currentFilter, setCurrentFilter] = useState<ChartFilter>(ChartFilter.DAY);
  const memberInfo = getCookie('member');
  const member = memberInfo ? JSON.parse(memberInfo) : null;

  const [date, setDate] = useState<AdminDateType>({
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });


  const [comparedDate, setComparedDate] = useState<AdminDateType>({
    startDate: formatDate(comparedStartDate),
    endDate: formatDate(comparedEndDate),
  });

  const {
    data: gaTopData,
    isLoading,
    isFetching
  } = useQuery<GAResponseTop, Object, GAResponseTop>({
      queryKey: ['gaTop', date, currentFilter],
    queryFn: () => getGoogleAnalyticsTop({
      startDate: date.startDate ? date.startDate : "",
      endDate: date.endDate ? date.endDate : "",
      sellerEmail: member.email,
      filter: currentFilter,
      comparedStartDate: comparedDate.startDate ? comparedDate.startDate : "",
      comparedEndDate: comparedDate.endDate ? comparedDate.endDate : "",
    }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
    enabled: !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
  });

  const dateChange = (value:DateValueType) => {

    if(value === null || value?.startDate === null || value?.endDate === null) {
      return;
    }

    //날짜 변환
    setDate({
      startDate: formatDate(new Date(value.startDate)),
      endDate: formatDate(new Date(value.endDate)),
    });

    const startDate = value.startDate
    const endDate = value.endDate

    // 두 날짜 간의 차이를 밀리초 단위로 계산
    const timeDifference = endDate.getTime() - startDate.getTime();
    // 밀리초를 일 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // 일 단위 차이

    // 새로운 날짜 계산
    const newEndDate = startDate; // startDate 복사
    newEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

    const newStartDate = newEndDate; // newEndDate 복사
    newStartDate.setDate(newEndDate.getDate() - dayDifference); // 차이만큼 날짜 빼기

    const comparedDate: AdminDateType = {
      startDate: formatDate(newStartDate),
      endDate: formatDate(newEndDate),
    };

    setComparedDate(comparedDate);
  };

  const filterChange = (filter: ChartFilter) => {
    setCurrentFilter(filter);
  }

  if(isLoading || isFetching) {
    return <DashboardSkeleton/>;
  }

  return (
      <>
        <div>
          <AdminDatePicker date={date} dateChange={dateChange} maxDate={endDate}/>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">compared to previous period
            ({comparedDate?.startDate} ~ {comparedDate?.endDate})
          </p>
        </div>
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-8">
            <LazyLoadWrapper fallback={<div>Loading...</div>}>
              <CardTraffic gaData={gaTopData}/>
            </LazyLoadWrapper>
            <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
              <TrafficSessionChart chart={gaTopData?.sessionChart} filterChange={filterChange} filter={currentFilter}/>
            </LazyLoadWrapper>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full min-h-[400px]">
              <MultiCirclesChart
                  percentages={[Number(gaTopData?.sessionsCompared), Number(gaTopData?.uniqueVisitorsCompared), Number(gaTopData?.avgSessionDurationCompared)]}
                  title={"Traffic Target"} labels={['Site sessions', 'Unique visitors', 'ASD']}
                  total={gaTopData?.sessions || ""}/>
            </LazyLoadWrapper>
          </div>

          <div className="col-span-12">
            <LazyLoadWrapper fallback={<div>Loading additional data...</div>}>
              <TrafficMiddleOverview
                  date={date}
                  comparedDate={comparedDate}
                  currentFilter={currentFilter}
                  sellerEmail={member?.email || ""}
              />
            </LazyLoadWrapper>
          </div>

          {/* 추가 데이터 영역: Lazy load AdditionalDataSection */}
          <div className="col-span-12">
            <LazyLoadWrapper fallback={<div>Loading additional data...</div>}>
              <TrafficBottomOverview
                  date={date}
                  comparedDate={comparedDate}
                  currentFilter={currentFilter}
                  sellerEmail={member?.email || ""}
              />
            </LazyLoadWrapper>
          </div>
        </div>
      </>
  );
};

export default TrafficOverview;
