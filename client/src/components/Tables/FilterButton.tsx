import {usePathname} from "next/navigation";
import Link from "next/link";

const FilterButton= () => {
    // const searchParams = useSearchParams();
    // const params = useSearchParams();
    // const page = params.get('page');

    const pathname = usePathname();

    return (
        <>
            <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown"
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-2 text-gray-400"
                     viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                          clipRule="evenodd"/>
                </svg>
                Filter
                <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
            </button>

            <div id="filterDropdown" className="z-10 w-48 p-3 rounded-lg shadow dark:bg-gray-700">
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">고르세요</h6>
                <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                    <Link href={`${pathname}?page=1&size=10`}>
                        <div className="flex items-center">
                            10
                        </div>
                    </Link>
                    <Link href={`${pathname}?page=1&size=20`}>
                        <div className="flex items-center">
                            20
                        </div>
                    </Link>
                    <Link href={`${pathname}?page=1&size=30`}>
                        <div className="flex items-center">
                            30
                        </div>
                    </Link>
                </ul>
            </div>
        </>
    );
}
export default FilterButton;