export const TableSkeleton = () => {

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm ">
            <div
                className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    {/* Skeleton Search Bar */}
                    <div className="h-10 bg-gray-200 rounded dark:bg-gray-600"></div>
                </div>
                <div
                    className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    {/* Skeleton Buttons */}
                    <div className="h-10 w-24 bg-gray-200 rounded dark:bg-gray-600"></div>
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded dark:bg-gray-600"></div>
                        <div className="h-10 w-10 bg-gray-200 rounded dark:bg-gray-600"></div>
                    </div>
                </div>
            </div>

            <div className="w-auto overflow-x-auto overflow-y-hidden">
                {/* Skeleton Table */}
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {Array(11)
                            .fill("")
                            .map((_, index) => (
                                <th key={index} scope="col" className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
                                </th>
                            ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array(5)
                        .fill("")
                        .map((_, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {Array(11)
                                    .fill("")
                                    .map((_, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-4 py-3 whitespace-nowrap"
                                        >
                                            <div className="h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
                                        </td>
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Skeleton Pagination */}
            <div className="px-4 py-6 md:px-6 xl:px-7.5 flex justify-between items-center">
                <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-600"></div>
                <div className="flex space-x-2">
                    {Array(5)
                        .fill("")
                        .map((_, index) => (
                            <div
                                key={index}
                                className="h-8 w-8 bg-gray-200 rounded-full dark:bg-gray-600"
                            ></div>
                        ))}
                </div>
            </div>
        </div>

    );
}