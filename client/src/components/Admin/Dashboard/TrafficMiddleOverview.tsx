"use client";
import React from "react";
import dynamic from "next/dynamic";
import {getGoogleAnalyticsMiddle} from "@/apis/dashbaordAPI";
import {GAResponseMiddle} from "@/interface/GAResponse";
import {DataResponse} from "@/interface/DataResponse";
import {useQuery} from "@tanstack/react-query";
import formatDate from "@/libs/formatDate";
import {DateRangeType} from "react-tailwindcss-datepicker/dist/types";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import {ChartFilter} from "@/types/chartFilter";

const TrafficPageChart = dynamic(() => import("./Charts/TrafficPageChart"), { ssr: false });
const TrafficSourceChart = dynamic(() => import("./Charts/TrafficSourceChart"), { ssr: false });
const PieChart = dynamic(() => import("./Charts/PieChart"), { ssr: false });

type Props = {
  date: DateRangeType;
  comparedDate: DateRangeType;
  currentFilter: ChartFilter;
  sellerEmail: string;
};
const TrafficMiddleOverview: React.FC<Props> = ({
                                                  date,
                                                  comparedDate,
                                                  currentFilter,
                                                  sellerEmail
                                                }) => {
  const {
    data: gaMiddleData,
  } = useQuery<DataResponse<GAResponseMiddle>, Object, GAResponseMiddle>({
    queryKey: ['gaMiddle', date, currentFilter],
    queryFn: () => getGoogleAnalyticsMiddle({
      startDate: date.startDate ? formatDate(new Date(date.startDate)) : "",
      endDate: date.endDate ? formatDate(new Date(date.endDate)) : "",
      sellerEmail: sellerEmail,
      filter: currentFilter,
      comparedStartDate: comparedDate.startDate ? formatDate(new Date(comparedDate.startDate)) : "",
      comparedEndDate: comparedDate.endDate ? formatDate(new Date(comparedDate.endDate)) : "",
    }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
    enabled: !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
    select: (data) => {
      // 데이터 가공 로직만 처리
      return data.data;
    }
  });


  // if(isLoading || isFetching) {
  //   return <DashboardSkeleton/>;
  // }

  return (
      <>
        <div className="col-span-12">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <TrafficPageChart topPages={gaMiddleData?.topPages || []}/>
          </LazyLoadWrapper>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <PieChart data={gaMiddleData?.visitors} title={"New vs returning visitors"} label="Site sessions"/>
          </LazyLoadWrapper>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <PieChart data={gaMiddleData?.devices} title={"Session by device"} label="Site sessions"/>
          </LazyLoadWrapper>
        </div>

        <div className="col-span-12 xl:col-span-4 ">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full min-h-[400px]">
            <TrafficSourceChart topSources={gaMiddleData?.topSources || []}/>
          </LazyLoadWrapper>
        </div>

      </>
  );
};

export default TrafficMiddleOverview;
