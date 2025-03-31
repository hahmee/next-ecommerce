"use client";
import React from "react";
import dynamic from "next/dynamic";
import {getGoogleAnalyticsMiddle} from "@/apis/dashbaordAPI";
import {GAResponseMiddle} from "@/interface/GAResponse";
import {DataResponse} from "@/interface/DataResponse";
import {useQuery} from "@tanstack/react-query";
import formatDate from "@/libs/formatDate";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import {ChartFilter} from "@/types/chartFilter";
import {AdminDateType} from "@/components/Admin/Dashboard/TrafficOverview";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import Skeleton from "@/components/Skeleton/Skeleton";
import LoadingSkeleton from "@/components/Skeleton/LoadingSkeleton";

const TrafficPageChart = dynamic(() => import("./Charts/TrafficPageChart"), { ssr: false });
const TrafficSourceChart = dynamic(() => import("./Charts/TrafficSourceChart"), { ssr: false });
const PieChart = dynamic(() => import("./Charts/PieChart"), { ssr: false });

type Props = {
  date: AdminDateType;
  comparedDate: AdminDateType;
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
      isLoading,
      isFetching
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


  if(isLoading || isFetching) {
      return <LoadingSkeleton/>;
  }

    return (
        <>
            <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5">
                <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
                    <TrafficPageChart topPages={gaMiddleData?.topPages || []}/>
                </LazyLoadWrapper>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                <div className="col-span-12 xl:col-span-4">
                    <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
                        <PieChart data={gaMiddleData?.visitors} title={"New vs returning visitors"}
                                  label="Site sessions"/>
                    </LazyLoadWrapper>
                </div>

                <div className="col-span-12 xl:col-span-4">
                    <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
                        <PieChart data={gaMiddleData?.devices} title={"Session by device"} label="Site sessions"/>
                    </LazyLoadWrapper>
                </div>

                <div className="col-span-12 xl:col-span-4">
                    <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full min-h-[400px]">
                        <TrafficSourceChart topSources={gaMiddleData?.topSources || []}/>
                    </LazyLoadWrapper>
                </div>
            </div>

        </>
    );
};

export default TrafficMiddleOverview;
