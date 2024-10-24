import React, { ReactNode } from "react";
import {ChartContext} from "@/types/chartContext";
import {GAResponse} from "@/interface/GAResponse";



const CardDataStats = ({gaData}:{gaData: GAResponse | undefined}) => {
//col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:col-span-8
    return (
        // <div className={`grid gap-4 divide-x rounded-sm border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark bg-white col-span-12 xl:col-span-8`}>
        <div className="col-span-12 xl:col-span-8 grid grid-cols-3 divide-x  rounded-sm border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark bg-white">
            <div>
                <div className="font-light text-sm">Site sessions</div>
                <div className="flex items-center justify-between">
                    <div className="font-bold">{gaData?.sessions}</div>
                    <div className="flex items-center">
                        {gaData?.sessionsCompared}
                        <svg
                            className="fill-meta-5"
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                                fill=""
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div>
                <div className="font-light text-sm">Unique visitors</div>
                <div className="flex items-center justify-between">
                    <div className="font-bold">{gaData?.uniqueVisitors}</div>
                    <div className="flex items-center">
                        {gaData?.uniqueVisitorsCompared}
                        <svg
                            className="fill-meta-5"
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                                fill=""
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div>
                <div className="font-light text-sm">Avg. session duration</div>
                <div className="flex items-center justify-between">
                    <div className="font-bold">{gaData?.avgSessionDuration}</div>
                    <div className="flex items-center">
                        {gaData?.avgSessionDurationCompared}
                        <svg
                            className="fill-meta-5"
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                                fill=""
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDataStats;
