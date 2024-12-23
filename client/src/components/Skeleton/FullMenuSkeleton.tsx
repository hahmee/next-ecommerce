import {Fragment} from "react";

const FullMenuSkeleton = () => {
    return (
        <div className="hidden xl:flex gap-4 relative">
            {/* 모달 바깥 클릭 */}
            <div className="z-1 fixed w-full overflow-hidden h-screen top-0 left-0"></div>

            <div>
                {/* Skeleton UI */}
                <div role="list" className="flex items-center justify-center w-full text-sm font-medium text-gray-900">
                    {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <Fragment key={index}>
                            <div className="relative flex items-center cursor-pointer px-3 gap-0.5 mx-1.5 py-2.5">
                                {/* Category Name Skeleton */}
                                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>

                                {/* Chevron Icon Skeleton */}
                                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse ml-2"></div>

                                {/* Subcategory Dropdown Skeleton */}
                                <div
                                    className="absolute w-56 rounded-lg bg-white shadow-lg top-12 z-20 opacity-0 scale-95 pointer-events-none">
                                    {[1, 2, 3].map((_, subIndex) => (
                                        <div
                                            key={subIndex}
                                            className="h-4 w-40 bg-gray-200 rounded my-1 animate-pulse"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );

}
export default FullMenuSkeleton;