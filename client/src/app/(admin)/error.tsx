'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('errorPage', error.message);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                    문제가 발생했습니다.
                </h2>
                <p className="text-gray-700 mb-2">
                    {error.message}
                </p>
                <p className="text-gray-600 mb-6">
                    서비스에 접속할 수 없습니다. 새로고침을 하거나 잠시 후 다시 접속해 주시기 바랍니다.
                </p>
                <button
                    onClick={() => reset()}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    새로고침
                </button>
            </div>
        </div>
    );
}
