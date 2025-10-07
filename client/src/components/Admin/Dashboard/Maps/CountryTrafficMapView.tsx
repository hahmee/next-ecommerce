'use client';

import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/jsvectormap.css';
import React, { useEffect, useState } from 'react';
import '../../../../js/world'; // 지도 파일
import { CountryChartDTO } from '@/interface/GAResponse';
import { BarChartThin } from '@/components/Admin/Dashboard/Charts/BarChart';
import Image from 'next/image';

const CountryTrafficMapView = ({ countries }: { countries: Array<CountryChartDTO> | undefined }) => {
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
            fill: '#3b82f6',
            opacity: 0.6,
            r: size, // 마커 크기를 r로 설정
          },
          hover: {
            fill: '#3C50E0',
          },
        },
      };
    });

    // 지도 초기화
    const mapOne = new jsVectorMap({
      selector: '#mapOne',
      map: 'world', // 세계 지도 설정
      markers: markers || [], // 마커 추가
      regionStyle: {
        initial: {
          fill: '#A2B6F2',
        },
      },
      markerShape: 'circle', // 마커를 원형으로 설정
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
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">Sessions by country</h4>
      <div className="h-90 grid grid-cols-12 gap-4">
        <div id="mapOne" className="mapOne map-btn xl:col-span-8 col-span-12" />
        <div className="xl:col-span-4 flex flex-col h-full col-span-12">
          <div className="">
            <div className="text-sm font-semibold">Countries</div>
            {paginatedCountries?.map((country, index) => (
              <div key={index} className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    width={500}
                    height={500}
                    src={country.svg}
                    alt={country.key}
                    className="rounded-full h-8 w-8 object-cover "
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-bold">{country.key}</span>
                    <span className="text-xs font-normal text-gray-600">
                      {Number(country.value).toLocaleString()} Sessions
                    </span>
                  </span>
                </div>

                <div className="w-36">
                  <BarChartThin data={country} totalSessions={totalSessions} />
                </div>
              </div>
            ))}
          </div>

          {/* 페이징 버튼 영역에 mt-auto로 하단 고정 */}
          {totalPages > 1 && (
            <div className="mt-auto flex justify-center ">
              <button
                className=" hover:bg-gray-50 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={` hover:bg-gray-50 relative text-gray-500 inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === i + 1 ? 'bg-primary-500 text-white' : ''
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className=" hover:bg-gray-50 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryTrafficMapView;
