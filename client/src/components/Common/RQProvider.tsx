'use client';

import React, { useState } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionExpiredError } from '@/libs/error/errors';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';

type Props = {
  children: React.ReactNode;
};

const RQProvider = ({ children }: Props) => {
  // 클라이언트용 QueryClient (useState(...))
  const [client] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          console.log('error', error);
          if (error instanceof SessionExpiredError) {
            useUserStore.getState().resetUser(); // Zustand 상태 초기화
            useUserStore.getState().setSessionExpired();
            toast.error('세션이 만료되었습니다.');
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          console.log('error', error);
          if (error instanceof SessionExpiredError) {
            useUserStore.getState().resetUser();
            useUserStore.getState().setSessionExpired();
            toast.error('세션이 만료되었습니다');
          }
        },
      }),
      defaultOptions: {
        // react-query 전역 설정
        queries: {
          refetchOnWindowFocus: false,
          retryOnMount: true, // 오류가 있을 시 재시도
          refetchOnReconnect: false,
          retry: false,
        },
      },
    }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={process.env.NEXT_PUBLIC_MODE === 'local'} />
    </QueryClientProvider>
  );
};

export default RQProvider;
