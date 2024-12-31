import {FunnelIcon} from "@heroicons/react/24/outline";

import React from "react";

const FilterButton = () => {

    return (
        <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown"
                className="w-full md:w-auto flex justify-center items-center  py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
            <FunnelIcon className="h-4 w-4 mr-1.5" />
            <span>필터</span>
        </button>
    );
}
export default FilterButton;