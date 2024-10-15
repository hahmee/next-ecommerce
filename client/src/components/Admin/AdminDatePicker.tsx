import Datepicker from "react-tailwindcss-datepicker";
import React, {useState} from "react";

const AdminDatePicker = () => {

    const [value, setValue] = useState<any>({
        startDate: null,
        endDate: null
    });

    return (
        <Datepicker
            value={value}
            onChange={(value)=>setValue(value)}
            showShortcuts={true}
        />

    )
};

export default AdminDatePicker;