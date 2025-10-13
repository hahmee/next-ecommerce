import { useState } from 'react';

import ClickOutside from "@/shared/ui/ClickOutside";


const ViewButton = ({ changeSize }: { changeSize: (size: number) => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('10');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    changeSize(Number(event.target.value));
    setOpen(false);
  };

  return (
    <div className="relative flex items-center ">
      <button
        id="filterDropdownButton"
        data-dropdown-toggle="filterDropdown"
        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-1 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        type="button"
        onClick={() => setOpen(!open)}
      >
        {selectedOption}개씩 보기
        <svg
          className="-mr-1 ml-1.5 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </button>

      {open && (
        <ClickOutside onClick={() => setOpen(false)}>
          <div
            id="filterDropdown"
            className="absolute z-1 w-48 p-3 bg-white right-0 top-12 rounded-lg shadow dark:bg-gray-700"
          >
            <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
              <li className="flex items-center">
                <input
                  id="ten"
                  type="radio"
                  value="10"
                  checked={selectedOption === '10'}
                  onChange={handleOptionChange}
                  className="hidden peer"
                />
                <label htmlFor="ten" className="flex items-center cursor-pointer">
                  <span className="w-4 h-4 mr-2 border border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-primary-600 peer-checked:border-transparent">
                    {selectedOption === '10' && (
                      <span className="w-2 h-2 dark:bg-white bg-primary-500 rounded-full" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    10개씩 보기
                  </span>
                </label>
              </li>

              <li className="flex items-center">
                <input
                  id="one"
                  type="radio"
                  value="1"
                  checked={selectedOption === '1'}
                  onChange={handleOptionChange}
                  className="hidden peer"
                />
                <label htmlFor="one" className="flex items-center cursor-pointer">
                  <span className="w-4 h-4 mr-2 border border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-primary-600 peer-checked:border-transparent">
                    {selectedOption === '1' && (
                      <span className="w-2 h-2 dark:bg-white bg-primary-500 rounded-full" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    1개씩 보기
                  </span>
                </label>
              </li>

              <li className="flex items-center">
                <input
                  id="three"
                  type="radio"
                  value="3"
                  checked={selectedOption === '3'}
                  onChange={handleOptionChange}
                  className="hidden peer"
                />
                <label htmlFor="three" className="flex items-center cursor-pointer">
                  <span className="w-4 h-4 mr-2 border border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-primary-600 peer-checked:border-transparent">
                    {selectedOption === '3' && (
                      <span className="w-2 h-2 dark:bg-white bg-primary-500 rounded-full" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    3개씩 보기
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </ClickOutside>
      )}
    </div>
  );
};
export default ViewButton;
