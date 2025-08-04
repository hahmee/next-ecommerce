import LazyLoadWrapper from "@/components/Common/LazyLoadWrapper";
import {useQuery} from "@tanstack/react-query";
import {MapResponse} from "@/interface/MapResponse";
import {getSalesByCountry} from "@/apis/dashbaordAPI";
import dynamic from "next/dynamic";
import React from "react";
import {DatepickType} from "@/types/DatepickType";

type Props = {
  date: DatepickType;
};

const SalesPieChart = dynamic(() => import("./SalesPieChart"), { ssr: false });
const CountryMap = dynamic(() => import("../Maps/CountryMap"), { ssr: false });

const CountryChart: React.FC<Props> = ({date}) => {
  const {
    data: countries,
  } = useQuery<Array<MapResponse>, Object, Array<MapResponse>>({
    queryKey: ['countries', date],
    queryFn: () => getSalesByCountry({
      startDate: date.startDate ? date.startDate : "",
      endDate: date.endDate ? date.endDate: "",
    }),
    staleTime: 60 * 1000,
    enabled: !!date.startDate && !!date.endDate,
    gcTime: 300 * 1000,
    throwOnError: true,
  });

  return <>
    {
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <CountryMap countries={countries}/></LazyLoadWrapper>
        </div>
    }
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
        <SalesPieChart countries={countries}/>
      </LazyLoadWrapper>
    </div>
  </>
}

export default CountryChart;