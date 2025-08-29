'use client';

// 클라이언트 전용, React query & CSR 처리
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import React, { ReactNode, Suspense } from 'react';
import SessionExpiredRedirect from '@/components/Error/SessionExpiredRedirect';
import { SessionExpiredError } from '@/libs/error/errors';

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
          fallbackRender={({ error, resetErrorBoundary }) => {
            if (error instanceof SessionExpiredError) {
              return <SessionExpiredRedirect />;
            }

            return (
              fallback ?? (
                <div className="p-4 border rounded text-red-600 bg-red-50">
                  <p>⚠️ 에러: {error.message}</p>
                  <button onClick={resetErrorBoundary} className="mt-2 underline">
                    다시 시도
                  </button>
                </div>
              )
            );
          }}
        >
          <Suspense fallback={<div>로딩 중...</div>}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
