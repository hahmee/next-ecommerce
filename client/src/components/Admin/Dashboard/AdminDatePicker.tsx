import Datepicker from "react-tailwindcss-datepicker";
import React from "react";
import {DateRangeType, DateType, DateValueType} from "react-tailwindcss-datepicker/dist/types";

const AdminDatePicker = ({date, dateChange, maxDate} : {date:DateRangeType| null, dateChange: (value:DateValueType) => void, maxDate?: DateType}) => {

    return (
        <Datepicker
            value={date}
            onChange={(value)=>dateChange(value)}
            showShortcuts={true}
            maxDate={maxDate}
        />

    )
};

export default AdminDatePicker;