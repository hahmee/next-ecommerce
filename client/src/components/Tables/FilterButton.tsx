import {useState} from "react";

const FilterButton= ({changeSize}:{changeSize: (size: number) => void}) => {

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>("");

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        changeSize(Number(event.target.value));
    };

    return (
        <div className="relative">
            <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown"
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button"
                    onClick={() => setOpen(!open)}>
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                     className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                          clipRule="evenodd"/>
                </svg>
                View
                <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
            </button>

            {
                open &&
                <div id="filterDropdown"
                     className="absolute z-10 w-48 p-3 bg-white right-0 top-12 rounded-lg shadow dark:bg-gray-700">
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose</h6>
                    <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                        <li className="flex items-center">
                            <input
                                id="ten"
                                type="radio"
                                value="10"
                                checked={selectedOption === "10"}
                                onChange={handleOptionChange}
                                className="hidden peer"
                            />
                            <label htmlFor="ten" className="flex items-center cursor-pointer">
                    <span className="w-4 h-4 mr-2 border border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-primary-600 peer-checked:border-transparent">
                        {selectedOption === "10" && (
                            <span className="w-2 h-2 dark:bg-white bg-primary-500 rounded-full"></span>
                        )}
                    </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        10개씩 보기
                    </span>
                            </label>
                        </li>
                        <li className="flex items-center">
                            <input
                                id="twenty"
                                type="radio"
                                value="20"
                                checked={selectedOption === "20"}
                                onChange={handleOptionChange}
                                className="hidden peer"
                            />
                            <label htmlFor="twenty" className="flex items-center cursor-pointer">
                    <span className="w-4 h-4 mr-2 border border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-primary-600 peer-checked:border-transparent">
                        {selectedOption === "20" && (
                            <span className="w-2 h-2 dark:bg-white bg-primary-500 rounded-full"></span>
                        )}
                    </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        20개씩 보기
                    </span>
                            </label>

                        </li>
                        <li className="flex items-center">
                            <input
                                id="thirty"
                                type="radio"
                                value="30"
                                checked={selectedOption === "30"}
                                onChange={handleOptionChange}
                                className="hidden peer"
                            />
                            <label htmlFor="thirty" className="flex items-center cursor-pointer">
                    <span
                        className="w-4 h-4 mr-2 border border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-primary-600 peer-checked:border-transparent">
                        {selectedOption === "30" && (
                            <span className="w-2 h-2 dark:bg-white bg-primary-500 rounded-full"></span>
                        )}
                    </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        30개씩 보기
                    </span>
                            </label>
                        </li>
                    </ul>

                    {/*<ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">*/}
                    {/*    <div className="flex items-center" onClick={() => changeSize(1)}>*/}
                    {/*        1*/}
                    {/*    </div>*/}
                    {/*    <div className="flex items-center" onClick={() => changeSize(2)}>*/}
                    {/*        2*/}
                    {/*    </div>*/}
                    {/*    <div className="flex items-center" onClick={() => changeSize(3)}>*/}
                    {/*        3*/}
                    {/*    </div>*/}
                    {/*</ul>*/}
                </div>
            }

        </div>
    );
}
export default FilterButton;