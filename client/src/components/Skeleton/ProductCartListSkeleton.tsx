const ProductCardListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="animate-pulse space-y-4">
                    <div className="w-full h-64 bg-gray-200 rounded-lg" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
};

export default ProductCardListSkeleton;
