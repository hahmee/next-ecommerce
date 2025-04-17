import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import React from "react";
import {BuildingStorefrontIcon, ShoppingBagIcon} from "@heroicons/react/24/outline";
import AdminUser from "@/components/Header/AdminUser";

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    return (
        <header className="fixed top-0 z-999 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            {/* 헤더 내부 너비 제한 */}
            <div className="mx-auto flex items-center px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                ></span>
                <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!h-0 !delay-200"
                    }`}
                ></span>
              </span>
            </span>
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <Link className="block flex-shrink-0 lg:hidden" href="/">
                        <BuildingStorefrontIcon className="h-7 w-7 text-ecom"/>
                    </Link>
                </div>

                {/* 오른쪽 요소들 */}
                <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {/* <!-- Dark Mode Toggler --> */}
                        <DarkModeSwitcher/>
                    </ul>

                    <Link href="/" className="text-right block">
                        <ShoppingBagIcon className="h-6 w-6 block text-sm font-medium text-ecom dark:text-ecom"/>
                        <span className="block text-xs text-ecom">Mall</span>
                    </Link>

                    {/* <!-- User Area --> */}
                    <AdminUser/>
                    {/* <!-- User Area --> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
