import React from 'react';

const ExpertListSkeleton = () => {
  return (
    <div className="mt-24 px-4">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* 헤더 영역 스켈레톤 */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-1/2 bg-gray-300 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
              <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
            </div>
          </div>

          {/* 제품 카드 그리드 스켈레톤 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                {/* 메인 이미지 스켈레톤 */}
                <div className="relative w-full h-48 bg-gray-300 rounded-lg" />

                {/* 서브 이미지 스켈레톤 */}
                <div className="flex gap-2 mt-2">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="relative w-1/3 h-20 bg-gray-300 rounded" />
                  ))}
                </div>

                {/* 텍스트 정보 스켈레톤 */}
                <div className="mt-4 space-y-2">
                  <div className="h-6 w-3/4 bg-gray-300 rounded" />
                  <div className="h-4 w-1/2 bg-gray-300 rounded" />
                  <div className="h-4 w-1/3 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertListSkeleton;
