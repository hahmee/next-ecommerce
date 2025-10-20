// app/(home)/error.tsx

'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[HOME ERROR]', error);
    toast.error('홈 페이지에서 오류가 발생했습니다.');
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">문제가 발생했습니다</h2>
        <p className="text-lg text-gray-700 mb-6">
          홈 화면을 불러오는 중 문제가 발생했어요.
          <br />
          새로고침하거나, 다시 시도해보세요.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
