import Datepicker from "react-tailwindcss-datepicker";
import React from "react";

const AdminDatePicker = ({date, dateChange} : {date:any, dateChange: (value:any) => void}) => {

    return (
        <Datepicker
            value={date}
            onChange={(value)=>dateChange(value)}
            showShortcuts={true}
        />

    )
};

export default AdminDatePicker;