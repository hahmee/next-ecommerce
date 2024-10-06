import {XCircleIcon} from "@heroicons/react/20/solid";
import React from "react";

const FiltersBadge = ({param, filters}:{param:any, filters:any}) => {



    return <div className="flex cursor-pointer justify-between w-36 text-sm rounded-3xl ring-1 border-gray-500 text-gray-500 py-2 px-4 text-center">
            <span>{param.value}</span>
            <XCircleIcon className="h-5 w-5"/>
        </div>
}
export default FiltersBadge;