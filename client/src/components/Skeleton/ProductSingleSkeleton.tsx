import React from "react";

const ProductSingleSkeleton = () => {
    return (
        <div className="px-4 mt-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
            {/* 이미지 섹션 */}
            <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
                <div className="w-full h-80 bg-gray-200 animate-pulse rounded-lg" />
            </div>
            {/* 텍스트 섹션 */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                {/* 상품명 */}
                <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
                {/* 설명 */}
                <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="h-[1px] bg-gray-100" />
                {/* 가격 */}
                <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
                <div className="h-[1px] bg-gray-100" />
                {/* 옵션 선택 */}
                <div className="space-y-4">
                    <div className="h-8 w-1/2 bg-gray-200 animate-pulse rounded" />
                    <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded" />
                </div>
                {/* 장바구니 추가 버튼 */}
                <div className="h-12 w-1/3 bg-gray-300 animate-pulse rounded" />
                <div className="h-[1px] bg-gray-100" />
                {/* 교환/환불 정책 */}
                <div className="space-y-4">
                    <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="h-[1px] bg-gray-100" />
                {/* 리뷰 */}
                <div className="space-y-4">
                    <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
                    <div className="space-y-4">
                        <div className="h-20 w-full bg-gray-200 animate-pulse rounded-lg" />
                        <div className="h-20 w-full bg-gray-200 animate-pulse rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSingleSkeleton;
