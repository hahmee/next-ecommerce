import React from "react";
import {TopPageDTO} from "@/interface/GAResponse";


const TrafficPageChart = ({topPages}:{topPages:Array<TopPageDTO> | []}) => {

    // 최대 세션 수를 구하여 바의 길이를 상대적으로 계산하기 위해 사용
    const maxSessions = Math.max(50, ...(topPages?.map((page) => Number(page?.pageSessions)) || []));


    return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
          <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
              <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
                  Top pages by sessions
              </h5>

              <div className="w-full space-y-2">
                  {topPages.map((page) => (
                      <div key={page.pagePath} className="flex">
                          {/*<span className="w-1/4 font-medium">{page.pagePath}</span>*/}
                          <div>
                              <span className="">{page.pagePath}</span>
                              <span className="">{Number(page.pageSessions).toLocaleString()}</span>
                          </div>
                          <div className="relative w-full bg-gray-300 rounded h-2">
                              <div className="bg-blue-500 h-full rounded" style={{width: `${(Number(page.pageSessions) / maxSessions) * 100}%`}}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

      </div>
    );
};

export default TrafficPageChart;
