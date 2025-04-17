const ProductFormSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="mx-auto">
                {/* Breadcrumb */}
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-8"></div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end mb-6">
                    <div className="h-10 bg-gray-300 rounded w-24"></div>
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>

                {/* Main Sections */}
                <div className="grid grid-cols-1 gap-9">
                    {/* Category Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <div className="h-5 bg-gray-300 rounded w-24"></div>
                            <div className="h-5 bg-gray-300 rounded w-32"></div>
                        </div>
                        <div className="p-6.5 mb-6">
                            <div className="h-10 bg-gray-300 rounded w-full"></div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <div className="h-5 bg-gray-300 rounded w-24"></div>
                        </div>
                        <div className="p-6.5">
                            <div className="h-40 bg-gray-300 rounded w-full"></div>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <div className="h-5 bg-gray-300 rounded w-24"></div>
                        </div>
                        <div className="p-6.5 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-300 rounded w-full"></div>
                            ))}
                        </div>
                    </div>

                    {/* Option Info Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <div className="h-5 bg-gray-300 rounded w-24"></div>
                        </div>
                        <div className="p-6.5 space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-300 rounded w-full"></div>
                            ))}
                        </div>
                    </div>

                    {/* Product Detail Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <div className="h-5 bg-gray-300 rounded w-24"></div>
                        </div>
                        <div className="p-6.5 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-300 rounded w-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFormSkeleton;
