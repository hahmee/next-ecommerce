import React from "react";
import BarChart from "@/components/Admin/Dashboard/Charts/BarChart";
import {SessionDTO} from "@/interface/GAResponse";


const TrafficPageChart = ({topSources}:{topSources:Array<SessionDTO> | []}) => {

    // 최대 세션 수를 구하여 바의 길이를 상대적으로 계산하기 위해 사용
    const maxSessions = Math.max(50, ...(topSources?.map((page) => Number(page?.value)) || []));


    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
                <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
                    Top traffic by sessions
                </h5>
            </div>


            <div className="w-full space-y-2 flex flex-col px-4.5 pt-4.5 pb-2.5">
                {topSources.map((source,index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-normal">{source.key}</span>
                            <span className="text-sm font-bold">{Number(source.value).toLocaleString()}</span>
                        </div>
                        <BarChart data={source} maxValue={maxSessions}/>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default TrafficPageChart;
