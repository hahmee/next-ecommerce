const ProductCardListSkeleton = () => {
    return (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
            <div className="group relative transition-shadow duration-300">
                {/* 이미지 부분 */}
                <div className="w-full bg-gray-200 h-80 rounded-2xl animate-pulse"></div>

                {/* 텍스트 및 정보 부분 */}
                <div className="mt-4 px-4 pb-4">
                    {/* 색상 선택 부분 */}
                    <div className="flex mb-4">
                        {Array.from({length: 3}).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-5 h-5 bg-gray-200 rounded-full ring-gray-300 mr-2 animate-pulse"
                            ></div>
                        ))}
                    </div>

                    {/* 상품명 */}
                    <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse"></div>

                    {/* 상품 설명 */}
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-4 animate-pulse"></div>

                    {/* 가격과 평점 */}
                    <div className="flex justify-between items-center mt-2">
                        <div className="h-6 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                        <div className="flex items-center">
                            <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="ml-1 h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardListSkeleton;
