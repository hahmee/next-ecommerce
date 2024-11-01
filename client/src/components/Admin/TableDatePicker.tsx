import Datepicker from "react-tailwindcss-datepicker";
import React from "react";

const TableDatePicker = ({ date, dateChange }: { date: any; dateChange: (value: any) => void }) => {
    return (
        <Datepicker
            inputClassName="relative transition-all duration-300 py-2 pl-4 pr-14 w-full border border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
            value={date}
            // toggleClassName="absolute right-0 h-full px-3 text-gray-400 md:right-0 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            popupClassName="transition-all ease-out duration-300 absolute z-99999 mt-[1px] text-sm lg:text-xs 2xl:text-sm right-0 translate-y-4 opacity-0 hidden mb-2.5 mt-2.5"
            onChange={(value) => dateChange(value)}
            showShortcuts={true}
        />
    );
};

export default TableDatePicker;
