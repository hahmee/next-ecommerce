"use client";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import React, {useEffect, useState} from "react";
import "../../../../js/world"; // 지도 파일
import {CountryChartDTO} from "@/interface/GAResponse";
import {BarChartThin} from "@/components/Admin/Dashboard/Charts/BarChart";
import Image from "next/image";

const CountryTrafficMap = ({ countries }: { countries: Array<CountryChartDTO> | undefined }) => {
  // const countries: Array<CountryChartDTO> = [
  //   { key: "KR", value: 18, latlng: [37.0, 127.5] },
  //   { key: "JP", value: 18, latlng: [36.0,138.0] },
  // ];

  // 한 페이지에 보여줄 아이템 수
  const pageSize = 5;
  // 총 페이지 수 계산
  const totalPages = countries ? Math.ceil(countries.length / pageSize) : 0;
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 해당하는 countries 배열 슬라이스
  const paginatedCountries = countries
      ? countries.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : [];

  const totalSessions = countries ? countries.reduce((acc, cur) => acc + Number(cur.value), 0) : 0;

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
      <div className="col-span-5 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
        <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Sessions by country
        </h4>
        <div className="h-90 grid grid-cols-12 gap-4">
          <div id="mapOne" className="mapOne map-btn xl:col-span-8 col-span-12"></div>
          <div className="xl:col-span-4 flex flex-col h-full col-span-12">
            <div className="">
              <div className="text-sm font-semibold">Countries</div>
              {paginatedCountries?.map((country, index) => (
                  <div key={index} className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image width={500} height={500} src={country.svg} alt={country.key} className="rounded-full h-8 w-8 object-cover "/>
                      <span className="flex flex-col">
                      <span className="text-sm font-bold">{country.key}</span>
                      <span className="text-xs font-normal text-gray-600">
                      {Number(country.value).toLocaleString()} Sessions
                      </span>
                    </span>

                    </div>

                    <div className="w-36">
                      <BarChartThin data={country} totalSessions={totalSessions}/>
                    </div>
                  </div>
              ))}
            </div>

            {/* 페이징 버튼 영역에 mt-auto로 하단 고정 */}
            {totalPages > 1 && (
                <div className="mt-auto flex justify-center space-x-2">
                  <button
                      className="px-3 py-1 border rounded"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                  >
                    이전
                  </button>
                  {Array.from({length: totalPages}, (_, i) => (
                      <button
                          key={i + 1}
                          className={`px-3 py-1 border rounded ${
                              currentPage === i + 1 ? "bg-primary-500 text-white" : ""
                          }`}
                          onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                  ))}
                  <button
                      className="px-3 py-1 border rounded"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                  >
                    다음
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );

};

export default CountryTrafficMap