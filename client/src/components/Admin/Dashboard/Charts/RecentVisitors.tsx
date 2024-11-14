import React from "react";
import {SessionDTO} from "@/interface/GAResponse";


const RecentVisitors = ({gaData}:{gaData:Array<SessionDTO>}) => {

    return (
        <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
                <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
                    Recent visitors
                </h5>
            </div>


            <div className="w-full space-y-2 flex flex-col px-4.5 pt-4.5 pb-2.5">

                {gaData.map((visitor) => (
                    <div key={visitor.key}>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold">Visitor # {visitor.key}</span>
                            <span className="text-sm font-bold"> {Number(visitor.value).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default RecentVisitors;
