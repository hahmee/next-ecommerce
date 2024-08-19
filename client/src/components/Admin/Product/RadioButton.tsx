"use client";
import {useState} from "react";
import {Option} from "@/interface/Option";



interface CheckboxProps {
    options: Array<Option>;
    name: string;
}

const RadioButton = ({options, name}: CheckboxProps) => {
    const [checkedValue, setCheckedValue] = useState<string>();

    const onChange = (value: string) => {
        console.log('value', value);
    }

    return (
        <>
            <div className="flex flex-wrap">
                {
                    options.map((option: Option) => (<div className="flex items-center me-4" key={option.id}>
                        <input id={option.id} defaultChecked={options[0].id === option.id ? true : false} type="radio"
                               value={option.id} onChange={(e) => onChange(e.target.value)} name={name}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor={option.id}
                               className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{option.content}</label>
                    </div>))

                }

            </div>
        </>
    );

};

export default RadioButton;
