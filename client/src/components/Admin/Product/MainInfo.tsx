import Image from "next/image";
import React from "react";

const MainInfo = () => {
    return (
        <div className="h-[calc(100vh-300px)] bg-[#F9F9F9] mt-50 flex items-center justify-center px-10">
            {/* 왼쪽: 이미지 */}
            <div className="relative flex-1">
                <Image
                    src="/main_kid.png"
                    alt="kid"
                    width={1000}
                    height={1000}
                    className="h-full w-full object-cover rounded-lg"
                />
            </div>

            {/* 오른쪽: 텍스트 */}
            <div className="flex-1 flex flex-col justify-center pl-10">
                <div className="font-extrabold text-6xl text-gray-900 mb-6">
                    Special offer <br /> in kids products
                </div>
                <div className="font-normal text-lg text-gray-500 mb-10">
                    Fashion is a form of self-expression and autonomy at a <br />
                    particular period and place.
                </div>
                <button className="mt-10 w-40 h-12 text-xl font-medium rounded-3xl ring-1 ring-ecom text-white py-2 px-4 bg-ecom hover:bg-ecomHigh hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none">
                    Discover me
                </button>
            </div>
        </div>
    );
};

export default MainInfo;
