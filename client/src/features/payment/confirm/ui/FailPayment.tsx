// src/features/payment/confirm/ui/FailPayment.tsx

import Link from 'next/link';

const FailPayment = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">결제 실패</h1>
        <p className="text-gray-700 mb-6">
          결제에 실패하였습니다. 다시 시도해 주시거나 고객센터로 문의 바랍니다.
        </p>
        <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};
export default FailPayment;
