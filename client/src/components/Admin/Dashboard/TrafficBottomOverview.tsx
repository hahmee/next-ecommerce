"use client";
import React from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import {getGoogleAnalyticsBottom} from "@/apis/dashbaordAPI";
import {GAResponseBottom} from "@/interface/GAResponse";
import {useQuery} from "@tanstack/react-query";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import {AdminDateType} from "@/components/Admin/Dashboard/TrafficOverview";
import LoadingSkeleton from "@/components/Skeleton/LoadingSkeleton";

type Props = {
  date: AdminDateType;
  comparedDate: AdminDateType;
  currentFilter: ChartFilter;
};

const CountryTrafficMap = dynamic(() => {
  console.log("CountryTrafficMap imported!");
  return import("./Maps/CountryTrafficMap");
}, { ssr: false });

const TrafficBottomOverview: React.FC<Props> = ({
                                                  date,
                                                  comparedDate,
                                                  currentFilter,
                                                }) => {

    const {
        data: gaBottomData,
        isLoading,
        isFetching
    } = useQuery<GAResponseBottom, Object, GAResponseBottom>({
        queryKey: ['gaBottom', date, currentFilter],
        queryFn: () => getGoogleAnalyticsBottom({
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


  if(isLoading || isFetching) {
    return <LoadingSkeleton/>;
  }

  return (
      <>
        <div className="col-span-12">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <CountryTrafficMap countries={gaBottomData?.countries}/>
          </LazyLoadWrapper>
        </div>
      </>
  );
};

export default TrafficBottomOverview;
