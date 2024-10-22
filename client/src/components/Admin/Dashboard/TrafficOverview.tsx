"use client";
import React, {useState} from "react";
import AdminDatePicker from "@/components/Admin/AdminDatePicker";
import SalesChart from "@/components/Admin/Dashboard/Charts/SalesChart";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {getSalesCharts} from "@/app/(admin)/admin/dashboard/_lib/getSalesCharts";
import {getCookie} from "cookies-next";
import {ChartResponse} from "@/interface/ChartResponse";
import {ChartFilter} from "@/types/chartFilter";
import {ChartContext} from "@/types/chartContext";
import {getSalesCards} from "@/app/(admin)/admin/dashboard/_lib/getSalesCards";
import {CardResponse} from "@/interface/CardResponse";
import {getTopCustomers} from "@/app/(admin)/admin/dashboard/_lib/getTopCustomers";
import {TopCustomerResponse} from "@/interface/TopCustomerResponse";
import {TopProductResponse} from "@/interface/TopProductResponse";
import {getTopProducts} from "@/app/(admin)/admin/dashboard/_lib/getTopProducts";
import dynamic from "next/dynamic";
import {getSalesByCountry} from "@/app/(admin)/admin/dashboard/_lib/getSalesByCountry";
import {MapResponse} from "@/interface/MapResponse";
import CardTraffic from "@/components/Admin/Dashboard/CardTraffic";
import {getGoogleAnalytics} from "@/app/(admin)/admin/dashboard/_lib/getGoogleAnalytics";
import {GoogleAnalyticsResponse} from "@/interface/GoogleAnalyticsResponse";

const data = {
  "startDate": "2024-10-01", //해당 날짜
  "endDate": "2024-10-15", //해당 날짜
  "filter": "day", //day, week, ...
  // "totalSales": 12000,   // 총매출  0
  // "totalOrders": 74,   // 총주문수 0
  // "avgOrderSale": 129,  // 평균 주문 금액 0
  "xaxis": [ //가로축
    "2024-10-01",
    "2024-10-02",
    "2024-10-03",
    "2024-10-04"
  ],
  "series": [
    {
      "name": "Total Sales",
      "data": [23, 11, 22, 27],
    },
    {
      "name": "Total Revenue",
      "data": [44, 22, 30, 45],
    }
  ],
};

const CountryMap = dynamic(() => import("./Maps/CountryMap"), { ssr: false });

const SalesPieChart = dynamic(() => import("./Charts/SalesPieChart"), { ssr: false });

const TrafficOverview: React.FC = () => {

  const [selectedCard, setSelectedCard] = useState<ChartContext>(ChartContext.TOPSALES);
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
  } = useQuery<DataResponse<GoogleAnalyticsResponse>, Object, GoogleAnalyticsResponse>({
    queryKey: ['ga', date],
    queryFn: () => getGoogleAnalytics({
      startDate: date.startDate,
      endDate: date.endDate,
      sellerEmail: member.email,
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

  const clickCard = (id:ChartContext) => {
    setSelectedCard(id);
  };


  return (
      <>
        <div>
          <AdminDatePicker date={date} dateChange={dateChange}/>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">compared to previous period
            ({comparedDate.startDate} ~ {comparedDate.endDate})</p>
        </div>
        <div className="grid grid-cols-1">

          <CardTraffic gaData={gaData}/>

        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          {/*<SalesChart chart={salesCharts} filterChange={filterChange} filter={currentFilter}/>*/}
          {/*<ChartTwo/>*/}
          <div className="col-span-12 xl:col-span-8">
          </div>
        </div>
      </>
  );
};

export default TrafficOverview;
