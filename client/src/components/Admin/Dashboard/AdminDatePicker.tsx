import Datepicker from "react-tailwindcss-datepicker";
import React from "react";
import {DateType, DateValueType} from "react-tailwindcss-datepicker/dist/types";
import {AdminDateType} from "@/components/Admin/Dashboard/TrafficOverview";

const AdminDatePicker = ({date, dateChange, maxDate} : {date: AdminDateType, dateChange: (value:DateValueType) => void, maxDate?: DateType}) => {
    const value = {
        startDate: new Date(date.startDate),
        endDate: new Date(date.endDate),
    };

    return (
        <Datepicker
            value={value}
            onChange={(value)=>dateChange(value)}
            showShortcuts={true}
            maxDate={maxDate}
        />

    )
};

export default AdminDatePicker;