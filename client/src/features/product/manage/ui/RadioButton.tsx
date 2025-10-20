// src/features/product/manage/ui/RadioButton.tsx

'use client';

import { memo, useState } from 'react';

import { Option } from '@/shared/model/Option';

interface CheckboxProps {
  options: Array<Option<string>>;
  name: string;
  originalData: string | undefined;
}

const RadioButton = memo(({ options, name, originalData }: CheckboxProps) => {
  const [checkedValue, setCheckedValue] = useState<string>();

  return (
    <div className="flex flex-wrap">
      {options.map((option: Option<string>) => (
        <div className="flex items-center me-4" key={option.id}>
          <input
            id={option.id}
            defaultChecked={originalData ? originalData === option.id : options[0].id === option.id}
            type="radio"
            value={option.id}
            name={name}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={option.id}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {option.content}
          </label>
        </div>
      ))}
    </div>
  );
});

RadioButton.displayName = 'RadioButton';
export default RadioButton;
