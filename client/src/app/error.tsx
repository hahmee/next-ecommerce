'use client'

import { useEffect } from 'react'
import toast from "react-hot-toast";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
        toast.error("오류가 발생했습니다: " + error.message);
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="text-center max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-red-600 mb-4">문제가 발생했습니다</h2>
                <p className="text-lg text-gray-700 mb-6">앗! 페이지 로드 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                    다시 시도
                </button>
            </div>
        </div>
    )
}
