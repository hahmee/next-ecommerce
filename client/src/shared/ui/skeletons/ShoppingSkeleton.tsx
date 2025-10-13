const ShoppingSkeleton = () => {
  return (
    <section className="w-full bg-white">
      <p className="text-lg mb-4 font-bold">주문내역</p>
      {/* 스켈레톤 로딩 상태 */}
      <table className="min-w-full bg-white border-gray-200">
        <thead>
          <tr className="bg-gray-50 text-sm font-black text-left">
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Total Amount</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b">
              {/* Order ID 스켈레톤 */}
              <td className="py-2 px-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
              </td>
              {/* Total Amount 스켈레톤 */}
              <td className="py-2 px-4">
                <div className="h-4 bg-gray-200 rounded w-20" />
              </td>
              {/* Status 스켈레톤 */}
              <td className="py-2 px-4">
                <div className="h-6 bg-gray-200 rounded w-28" />
              </td>
              {/* Date 스켈레톤 */}
              <td className="py-2 px-4">
                <div className="h-4 bg-gray-200 rounded w-32" />
              </td>
              {/* 상세보기 버튼 스켈레톤 */}
              <td className="py-2 px-4 flex justify-end">
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
export default ShoppingSkeleton;
