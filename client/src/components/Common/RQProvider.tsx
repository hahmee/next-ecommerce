'use client';

import React, { useState } from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionExpiredError } from '@/libs/error/errors';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';

type Props = { children: React.ReactNode };

const RQProvider = ({ children }: Props) => {
  const [client] = useState(
    new QueryClient({
      // useQuery
      queryCache: new QueryCache({
        onError: (error) => {
          // throwOnError: false인 쿼리, 백그라운드 리패치 에러 등이 여기로 옴
          if (error instanceof SessionExpiredError) {
            const store = useUserStore.getState();
            store.resetUser();
            store.setSessionExpired();
            toast.error('세션이 만료되었습니다.');
            return;
          }
          const msg = error instanceof Error ? error.message : '요청 실패';
          toast.error(msg);
        },
      }),
      // useMutation
      mutationCache: new MutationCache({
        onError: (error) => {
          if (error instanceof SessionExpiredError) {
            const store = useUserStore.getState();
            store.resetUser();
            store.setSessionExpired();
            //SessionExpiredRedirect가 로그인 페이지로 이동시킴
            toast.error('세션이 만료되었습니다.');
            return;
          }
          const msg = error instanceof Error ? error.message : '요청 실패';
          toast.error(msg);
        },
      }),
      // 기본 동작 옵션을 전역으로 정의
      defaultOptions: {
        queries: {
          throwOnError: false, // 기본은 ErrorBoundary로 throw하지 않고 error state로만 관리
          refetchOnWindowFocus: false,
          retryOnMount: true,
          refetchOnReconnect: false,
          retry: false,  // 실패 시 자동 재시도 안 함
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
