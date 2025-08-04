"use client";
import React from "react";
import dynamic from "next/dynamic";
import {getGoogleAnalyticsMiddle} from "@/apis/dashbaordAPI";
import {GAResponseMiddle} from "@/interface/GAResponse";
import {useQuery} from "@tanstack/react-query";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import {ChartFilter} from "@/types/chartFilter";
import LoadingSkeleton from "@/components/Skeleton/LoadingSkeleton";
import {DatepickType} from "@/types/DatepickType";

const TrafficPageChart = dynamic(() => import("./Charts/TrafficPageChart"), { ssr: false });
const TrafficSourceChart = dynamic(() => import("./Charts/TrafficSourceChart"), { ssr: false });
const PieChart = dynamic(() => import("./Charts/PieChart"), { ssr: false });

type Props = {
  date: DatepickType;
  comparedDate: DatepickType;
};
const TrafficMiddleOverview: React.FC<Props> = ({
                                                  date,
                                                  comparedDate,
                                                }) => {

  const {
    data: gaMiddleData,
      isLoading,
      isFetching
  } = useQuery<GAResponseMiddle, Object, GAResponseMiddle>({
    queryKey: ['gaMiddle', date],
    queryFn: () => getGoogleAnalyticsMiddle({
      startDate: date.startDate,
      endDate: date.endDate,
      filter: ChartFilter.DAY ,//어차피 필요없으니 기본 값으로 둔다
      comparedStartDate: comparedDate.startDate,
      comparedEndDate: comparedDate.endDate,
    }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
    enabled: !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
  });


  if(isLoading || isFetching) {
      return <LoadingSkeleton/>;
  }

    return (
        <>
            <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5">
                <LazyLoadWrapper fallback={<div><LoadingSkeleton/></div>} className="min-h-[400px]">
                    <TrafficPageChart topPages={gaMiddleData?.topPages || []}/>
                </LazyLoadWrapper>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                <div className="col-span-12 xl:col-span-4">
                    <LazyLoadWrapper fallback={<div><LoadingSkeleton/></div>} className="min-h-[400px]">
                        <PieChart data={gaMiddleData?.visitors} title={"New vs returning visitors"} label="Site sessions"/>
                    </LazyLoadWrapper>
                </div>

                <div className="col-span-12 xl:col-span-4">
                    <LazyLoadWrapper fallback={<div><LoadingSkeleton/></div>} className="min-h-[400px]">
                        <PieChart data={gaMiddleData?.devices} title={"Session by device"} label="Site sessions"/>
                    </LazyLoadWrapper>
                </div>

                <div className="col-span-12 xl:col-span-4">
                    <LazyLoadWrapper fallback={<div><LoadingSkeleton/>re</div>} className="h-full min-h-[400px]">
                        <TrafficSourceChart topSources={gaMiddleData?.topSources || []}/>
                    </LazyLoadWrapper>
                </div>
            </div>

        </>
    );
};

export default React.memo(TrafficMiddleOverview);
