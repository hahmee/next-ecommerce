const OrderDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        {/* 주문 정보 */}
        <div className="mb-15">
          <h2 className="text-lg font-semibold mb-2">주문 정보</h2>
          <ul className="border border-gray-200 rounded p-3 text-xs animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx} className="flex justify-between py-1.5">
                <span className="w-24 h-4 bg-gray-200 rounded" />
                <span className="w-28 h-4 bg-gray-200 rounded" />
              </li>
            ))}
          </ul>
        </div>

        {/* 주문 상품 목록 */}
        <div className="mb-15">
          <h2 className="text-lg font-semibold mb-2">주문 상품</h2>
          <ul className="animate-pulse">
            {Array.from({ length: 2 }).map((_, idx) => (
              <li
                key={idx}
                className="flex flex-col p-3 mb-3 border gap-y-3 border-gray-200 rounded"
              >
                <span className="w-20 h-4 bg-gray-200 rounded" />
                <div className="flex gap-3 justify-between">
                  <div className="flex gap-x-3">
                    <div className="w-20 h-20 bg-gray-200 rounded" />
                    <div className="flex flex-col gap-1 text-xs">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className="w-24 h-4 bg-gray-200 rounded" />
                      ))}
                    </div>
                  </div>
                  <div className="w-28 h-8 bg-gray-200 rounded" />
                </div>
                <div className="bg-gray-50 flex flex-col p-3 rounded text-xs">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <span key={idx} className="w-32 h-4 bg-gray-200 rounded" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 받는 사람 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">받는사람 정보</h2>
          <ul className="border border-gray-200 rounded p-3 text-xs animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx} className="flex justify-between py-1.5">
                <span className="w-24 h-4 bg-gray-200 rounded" />
                <span className="w-28 h-4 bg-gray-200 rounded" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailSkeleton;
