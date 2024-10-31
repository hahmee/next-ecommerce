import Datepicker from "react-tailwindcss-datepicker";
import React from "react";

const TableDatePicker = ({ date, dateChange }: { date: any; dateChange: (value: any) => void }) => {
    return (
        <Datepicker
            value={date}
            onChange={(value) => dateChange(value)}
            showShortcuts={true}
            className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-100 !outline-none !shadow-none"

        />
    );
};

export default TableDatePicker;
