"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import AdminDatePicker from "@/components/Admin/Dashboard/AdminDatePicker";
import {getGoogleAnalyticsTop} from "@/apis/dashbaordAPI";
import {GAResponseTop} from "@/interface/GAResponse";
import {useQuery} from "@tanstack/react-query";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import {DateValueType} from "react-tailwindcss-datepicker/dist/types";
import dayjs from "dayjs";
import {DatepickType} from "@/types/DatepickType";

const CardTraffic = dynamic(() => import("./CardTraffic"), { ssr: false });
const TrafficSessionChart = dynamic(() => import("./Charts/TrafficSessionChart"), { ssr: false });
const MultiCirclesChart = dynamic(() => import("./Charts/MultiCirclesChart"), { ssr: false });
const TrafficMiddleOverview = dynamic(() => import("./TrafficMiddleOverview"), { ssr: false });
const TrafficBottomOverview = dynamic(() => import("./TrafficBottomOverview"), { ssr: false });


const TrafficOverview = () => {

  const today = dayjs(); // 오늘
  const end = today.subtract(1, "day"); // 어제
  const start = end.subtract(30, "day"); // 31일 전 (총 31일 구간)

  const [currentFilter, setCurrentFilter] = useState<ChartFilter>(ChartFilter.DAY);

  const [date, setDate] = useState<DatepickType>({
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
  });

  const [comparedDate, setComparedDate] = useState<DatepickType>(() => {
    const comparedEnd = start.subtract(1, "day");
    const comparedStart = comparedEnd.subtract(30, "day");

    return {
      startDate: comparedStart.format("YYYY-MM-DD"),
      endDate: comparedEnd.format("YYYY-MM-DD"),
    };
  });

  const {
    data: gaTopData,
    isLoading,
    isFetching
  } = useQuery<GAResponseTop, Object, GAResponseTop>({
    queryKey: ['gaTop', date, currentFilter],
    queryFn: () => getGoogleAnalyticsTop({
      startDate: date.startDate,
      endDate: date.endDate,
      filter: currentFilter,
      comparedStartDate: comparedDate.startDate,
      comparedEndDate: comparedDate.endDate,
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

    const start = dayjs(value.startDate);
    const end = dayjs(value.endDate);

    setDate({
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
    });

    const diff = end.diff(start, "day");

    const newEnd = start.subtract(1, "day");
    const newStart = newEnd.subtract(diff, "day");

    setComparedDate({
      startDate: newStart.format("YYYY-MM-DD"),
      endDate: newEnd.format("YYYY-MM-DD"),
    });

  };

  const filterChange = (filter: ChartFilter) => {
    setCurrentFilter(filter);
  }


  return (
      <>
        <div>
          <AdminDatePicker date={date} dateChange={dateChange} maxDate={dayjs().toDate()} />
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
              />
            </LazyLoadWrapper>
          </div>

          {/* 추가 데이터 영역: Lazy load AdditionalDataSection */}
          <div className="col-span-12">
            <LazyLoadWrapper fallback={<div>Loading additional data...</div>}>
              <TrafficBottomOverview
                  date={date}
                  comparedDate={comparedDate}
              />
            </LazyLoadWrapper>
          </div>
        </div>
      </>
  );
};

export default TrafficOverview;
