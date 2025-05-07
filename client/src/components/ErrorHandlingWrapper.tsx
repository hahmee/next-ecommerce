'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import React, { ReactNode, Suspense } from 'react';

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

export default function ErrorHandlingWrapper({ children, fallback }: Props) {
    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ error, resetErrorBoundary }) =>
                        fallback ?? (
                            <div className="p-4 border rounded text-red-600 bg-red-50">
                                <p>⚠️ 에러: {error.message}</p>
                                <button onClick={resetErrorBoundary} className="mt-2 underline">
                                    다시 시도
                                </button>
                            </div>
                        )
                    }
                >
                    <Suspense fallback={<div>로딩 중...</div>}>
                        {children}
                    </Suspense>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
}
