import React from "react";
import {SessionDTO} from "@/interface/GAResponse";
import BarChart from "@/components/Admin/Dashboard/Charts/BarChart";


const TrafficPageChart = ({topPages}:{topPages:Array<SessionDTO<number>> | []}) => {

    // 최대 세션 수를 구하여 바의 길이를 상대적으로 계산하기 위해 사용
    const maxSessions = Math.max(500, ...(topPages?.map((page) => Number(page?.value)) || []));


    return (
        <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
                <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
                    Top pages by sessions
                </h5>
            </div>


            <div className="w-full space-y-2 flex flex-col px-4.5 pt-4.5 pb-2.5">
                {topPages.map((page) => (
                    <div key={page.key}>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-normal">{
                                page.key === "/" ? "Homepage" : page.key
                            }</span>
                            <span className="text-sm font-bold">{Number(page.value).toLocaleString()}</span>
                        </div>
                        <BarChart data={page} maxValue={maxSessions}/>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default TrafficPageChart;
