import {SessionDTO} from "@/interface/GAResponse";
import React from "react";

const PageRoute = ({gaData}:{ gaData:Array<SessionDTO<Array<SessionDTO<number>>>> | undefined;}) => {
    console.log('gaData', gaData);
    return (
        <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="justify-between flex flex-col border-b border-stroke dark:border-strokedark">
                <h5 className="text-xl px-4.5 py-4.5 font-semibold text-black dark:text-white">
                    지난 30분 동안의 페이지 경로 및 화면 클래스
                </h5>
            </div>
        </div>
    )
};

export default PageRoute;
