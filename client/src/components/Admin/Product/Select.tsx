"use client";
import React, { useState } from "react";
import {Option} from "@/interface/Option";


interface SelectProps {
    label?:string,
    options: Array<Option<string>>;
    defaultOption?: string;
    name: string;
    originalData: string | undefined;
    doAction?: (value: string) => void;
}

const Select = ({label, options, defaultOption, name, originalData, doAction}: SelectProps) => {
    const [selectedOption, setSelectedOption] = useState<string>(originalData ? originalData : "");
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    return (
        <div>
            {
                label && <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {label} <span className="text-meta-1">*</span>
                </label>
            }

            <div className="relative bg-white dark:bg-form-input">
                <select
                    value={selectedOption}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setSelectedOption(e.target.value);
                        changeTextColor();
                        doAction && doAction(e.target.value);
                    }}
                    name={name}
                    required
                    className={`relative w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                        isOptionSelected ? "text-black dark:text-white" : ""
                    }`}
                >
                    {
                        defaultOption && <option value="" disabled className="text-body dark:text-bodydark">
                            {defaultOption}
                        </option>
                    }

                    {
                        options.map(option => <option key={option.id as string} value={option.id as string}
                                                      className="text-body dark:text-bodydark">
                            {option.content}
                        </option>)
                    }
                </select>

                <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill="#637381"
              ></path>
            </g>
          </svg>
        </span>
            </div>
        </div>
    );
};

export default Select;
