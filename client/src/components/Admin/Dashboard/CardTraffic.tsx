import React, { ReactNode } from "react";
import {ChartContext} from "@/types/chartContext";



const CardDataStats: React.FC = () => {

    return (
        <div
            className={`w-full grid grid-cols-3 gap-4 divide-x rounded-sm border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark bg-white `}>
            <div>
                <div>Site sessions</div>
                <div className="flex items-center justify-between">
                    <div>1,731</div>
                    <div className="flex items-center">
                        100%
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
                <div>Unique visitors</div>
                <div className="flex items-center justify-between">
                    <div>1,731</div>
                    <div className="flex items-center">
                        100%
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
                <div>Avg. session duration</div>
                <div className="flex items-center justify-between">
                    <div>1,731</div>
                    <div className="flex items-center">
                        100%
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
