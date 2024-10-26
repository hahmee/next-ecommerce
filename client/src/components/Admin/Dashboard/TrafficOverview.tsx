"use client";
import React, {useState} from "react";
import AdminDatePicker from "@/components/Admin/AdminDatePicker";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {getCookie} from "cookies-next";
import {ChartFilter} from "@/types/chartFilter";
import dynamic from "next/dynamic";
import CardTraffic from "@/components/Admin/Dashboard/CardTraffic";
import {getGoogleAnalytics} from "@/app/(admin)/admin/dashboard/_lib/getGoogleAnalytics";
import {GAResponse} from "@/interface/GAResponse";
import TrafficSessionChart from "@/components/Admin/Dashboard/Charts/TrafiicSessionChart";


const TrafficPageChart = dynamic(() => import("./Charts/TrafficPageChart"), { ssr: false });
const TrafficSourceChart = dynamic(() => import("./Charts/TrafficSourceChart"), { ssr: false });
const PieChart = dynamic(() => import("./Charts/PieChart"), { ssr: false });
const CountryTrafficMap = dynamic(() => import("./Maps/CountryTrafficMap"), { ssr: false });



const TrafficOverview: React.FC = () => {

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
    startDate: startDate.toISOString().split("T")[0], // format as YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0], // format as YYYY-MM-DD
  });

  const [comparedDate, setComparedDate] = useState({
    startDate: comparedStartDate.toISOString().split("T")[0],
    endDate: comparedEndDate.toISOString().split("T")[0],
  });


  const {
    data: gaData,
  } = useQuery<DataResponse<GAResponse>, Object, GAResponse>({
    queryKey: ['ga', date, currentFilter],
    queryFn: () => getGoogleAnalytics({
      startDate: date.startDate,
      endDate: date.endDate,
      sellerEmail: member.email,
      filter: currentFilter,
      comparedStartDate: comparedStartDate.toISOString().split("T")[0],
      comparedEndDate: comparedEndDate.toISOString().split("T")[0],
    }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: false,
    select: (data) => {
      // 데이터 가공 로직만 처리
      return data.data;
    }
  });


  console.log('gaData', gaData);

  const dateChange = (value:any) => {

    // value.startDate와 value.endDate를 Date 객체로 변환
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    // YYYY-MM-DD 형식으로 변환
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    // 두 날짜 간의 차이를 밀리초 단위로 계산
    const timeDifference = endDate.getTime() - startDate.getTime();
    // 밀리초를 일 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // 일 단위 차이

    // 새로운 날짜 계산
    const newEndDate = new Date(startDate); // endDate 복사
    newEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

    const newStartDate = new Date(newEndDate); // newEndDate 복사
    newStartDate.setDate(newEndDate.getDate() - dayDifference); // 차이만큼 날짜 빼기

    // YYYY-MM-DD 형식으로 변환
    const formattedNewStartDate = newStartDate.toISOString().split("T")[0];
    const formattedNewEndDate = newEndDate.toISOString().split("T")[0];

    // 날짜 객체 설정
    const date = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    const comparedDate = {
      startDate: formattedNewStartDate,
      endDate: formattedNewEndDate,
    };

    setDate(date);
    setComparedDate(comparedDate);
  };

  const filterChange = (filter: ChartFilter) => {
    setCurrentFilter(filter);
  }

  return (
      <>
        <div>
          <AdminDatePicker date={date} dateChange={dateChange}/>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">compared to previous period
            ({comparedDate.startDate} ~ {comparedDate.endDate})</p>
        </div>
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-8">
            <CardTraffic gaData={gaData}/>
            <TrafficSessionChart chart={gaData?.sessionChart}  filterChange={filterChange} filter={currentFilter}/>
            <div className="grid grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
              <PieChart data={gaData?.visitors} title={"New vs returning visitors"}/>
              <PieChart data={gaData?.devices} title={"Session by device"}/>
            </div>

          </div>
          <div className="col-span-12 xl:col-span-4">
            <TrafficPageChart topPages={gaData?.topPages || []}/>
            <TrafficSourceChart topSources={gaData?.topSources || []}/>
          </div>

          <div className="col-span-12">
          <CountryTrafficMap countries={gaData?.countries}/>
          </div>
        </div>

      </>
  );
};

export default TrafficOverview;
