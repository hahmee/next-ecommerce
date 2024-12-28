import ClickOutside from "@/components/ClickOutside";
import React, {useState} from "react";
import {EllipsisHorizontalIcon} from "@heroicons/react/20/solid";

interface DropdownPosition {
    top: number;
    left: number;
}
const TableActions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownToggle = (event: React.MouseEvent<HTMLButtonElement>) => {

        event.stopPropagation()

        setDropdownOpen(!dropdownOpen);
    };

    return (
        <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
            <button
                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                type="button"
                onClick={handleDropdownToggle}
            >
                <EllipsisHorizontalIcon className="h-6 w-6" />
            </button>

            {dropdownOpen && (
                <div
                    className="absolute w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 z-50"
                >
                    {children}
                </div>
            )}
        </ClickOutside>
    );
};

export default TableActions;
