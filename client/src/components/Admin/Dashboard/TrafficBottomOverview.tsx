"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import {ChartFilter} from "@/types/chartFilter";
import {getGoogleAnalyticsBottom} from "@/apis/dashbaordAPI";
import {GAResponseBottom} from "@/interface/GAResponse";
import {DataResponse} from "@/interface/DataResponse";
import {useQuery} from "@tanstack/react-query";
import {getCookie} from "cookies-next";
import formatDate from "@/libs/formatDate";
import {DateRangeType} from "react-tailwindcss-datepicker/dist/types";
import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";

type Props = {
  date: DateRangeType;
  comparedDate: DateRangeType;
  currentFilter: ChartFilter;
  sellerEmail: string;
};

const CountryTrafficMap = dynamic(() => {
  console.log("CountryTrafficMap imported!");
  return import("./Maps/CountryTrafficMap");
}, { ssr: false });

const TrafficBottomOverview: React.FC<Props> = ({
                                                  date,
                                                  comparedDate,
                                                  currentFilter,
                                                  sellerEmail
                                                }) => {

  const {
    data: gaBottomData
  } = useQuery<DataResponse<GAResponseBottom>, Object, GAResponseBottom>({
    queryKey: ['gaBottom', date, currentFilter],
    queryFn: () => getGoogleAnalyticsBottom({
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
        {/* 추가 데이터 영역: Lazy load AdditionalDataSection */}
        <div className="col-span-12">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <CountryTrafficMap countries={gaBottomData?.countries}/>
          </LazyLoadWrapper>
        </div>
      </>
  );
};

export default TrafficBottomOverview;
