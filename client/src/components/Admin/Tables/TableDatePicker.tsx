import Datepicker from "react-tailwindcss-datepicker";
import React from "react";
import {DateValueType} from "react-tailwindcss-datepicker/dist/types";
import {DatepickType} from "@/types/DatepickType";
import dayjs from "dayjs";

const TableDatePicker = ({date, dateChange}: { date: DatepickType, dateChange: (value:DateValueType) => void }) => {
  const value = {
    startDate: dayjs(date.startDate).toDate(),
    endDate: dayjs(date.endDate).toDate(),

  };

  return (
    <Datepicker
      inputClassName="relative transition-all duration-300 py-2 pl-4 pr-14 w-full border border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
      value={value}
      onChange={(value) => dateChange(value)}
      showShortcuts={true}
      popupClassName={(existingClasses) => `${existingClasses || ""} z-9999`.trim()}
    />);
};

export default TableDatePicker;
