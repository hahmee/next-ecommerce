"use client";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import React, { useEffect } from "react";
import "../../../../js/world"; // 지도 파일
import { CountryChartDTO } from "@/interface/GAResponse";
import BarChart from "@/components/Admin/Dashboard/Charts/BarChart";

const CountryTrafficMap = ({ countries }: { countries: Array<CountryChartDTO> | undefined }) => {
  // const countries: Array<CountryChartDTO> = [
  //   { key: "KR", value: 18, latlng: [37.0, 127.5] },
  //   { key: "JP", value: 18, latlng: [36.0,138.0] },
  // ];

  // 최대 세션 수를 구하여 바의 길이를 상대적으로 계산하기 위해 사용
  const maxSessions = Math.max(50, ...(countries?.map((country) => Number(country?.value)) || []));

  useEffect(() => {
    // 각 나라에 대한 마커 데이터 생성
    const markers = countries?.map((country) => {
      const size = Math.sqrt(country.value) * 5; // 값에 비례하여 크기 조정
      return {
        name: country.key,
        coords: country.latlng,
        style: {
          initial: {
            fill: "#3b82f6",
            opacity: 0.6,
            r: size, // 마커 크기를 r로 설정
          },
          hover: {
            fill: "#3C50E0",
          },
        },
      };
    });

    // 지도 초기화
    const mapOne = new jsVectorMap({
      selector: "#mapOne",
      map: "world", // 세계 지도 설정
      markers: markers || [], // 마커 추가
      regionStyle: {
        initial: {
          fill: "#A2B6F2",
        },
      },
      // markerStyle: {
      //   initial: {
      //     fill: "green", // 초기 색상
      //     opacity: 0.6,  // 투명도 설정
      //   },
      //   hover: {
      //     fill: "#FF5733", // 마우스 오버시 색상
      //   },
      // },

      markerShape: "circle", // 마커를 원형으로 설정
      focusOn: {
        animate: true,
      },
    });

    return () => {
      mapOne.destroy(); // 컴포넌트 언마운트 시 지도 제거
    };
  }, [countries]);

  return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
        <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Sessions by country
        </h4>
        <div className="h-90 grid grid-cols-12 gap-4">
          <div id="mapOne" className="mapOne map-btn col-span-8"></div>
          <div className="col-span-4">
            <div className="text-sm font-semibold">Countries</div>
            {countries?.map((country) => (
                <div key={country.key} className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-normal">{country.key}</span>
                    <span className="text-sm font-bold">{Number(country.value).toLocaleString()}</span>
                  </div>
                  <BarChart data={country} maxValue={maxSessions}/>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default CountryTrafficMap;
