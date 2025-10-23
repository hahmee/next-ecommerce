// src/shared/ui/skeletons/ListPageSkeleton.tsx

const ListPageSkeleton = () => {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <div className="w-1/2">
            {/* 제목 영역 스켈레톤 */}
            <div className="w-3/4 h-10 bg-gray-300 rounded-md mb-2" />
            {/* 설명 텍스트 스켈레톤 */}
            <div className="w-1/2 h-6 bg-gray-200 rounded-md" />
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* 필터 섹션 */}
            <form className="hidden lg:block">
              <div className="space-y-4">
                {/* 카테고리 필터 스켈레톤 */}
                <div className="h-10 bg-gray-300 rounded-md" />
                {/* 필터 옵션 스켈레톤 */}
                <div className="h-10 bg-gray-300 rounded-md" />
              </div>
            </form>

            {/* 상품 그리드 섹션 */}
            <div className="lg:col-span-3">
              {/* 배지 영역 */}
              <div className="w-full flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {/* 배지 스켈레톤 */}
                  <div className="h-6 w-20 bg-gray-200 rounded-md" />
                </div>
                {/* 정렬 옵션 스켈레톤 */}
                <div className="h-10 bg-gray-200 w-24 rounded-md" />
              </div>

              {/* 상품 목록 그리드 */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                {/* 상품 카드들 */}
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="animate-pulse space-y-4">
                    <div className="w-full h-64 bg-gray-200 rounded-lg" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default ListPageSkeleton;
