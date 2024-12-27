import Datepicker from "react-tailwindcss-datepicker";
import React from "react";

const TableDatePicker = ({date, dateChange}: { date: any; dateChange: (value: any) => void }) => {

    const handleDateChange = (value: any) => {
        dateChange(value);
    };

    return (
        <Datepicker
            inputClassName="relative transition-all duration-300 py-2 pl-4 pr-14 w-full border border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
            value={date}
            onChange={handleDateChange}
            showShortcuts={true}
            popupClassName={(existingClasses) => `${existingClasses || ""} z-9999`.trim()}
        />);
};

export default TableDatePicker;
