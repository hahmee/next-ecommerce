"use client";

import React, {useState} from "react";
import {QueryClientProvider, QueryClient, QueryCache} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import toast from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

function RQProvider({children}: Props) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {  // react-query 전역 설정
        queries: {
          refetchOnWindowFocus: false,
          retryOnMount: true,
          refetchOnReconnect: false,
          retry: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={process.env.NEXT_PUBLIC_MODE === 'local' }/>
    </QueryClientProvider>
  );
}

export default RQProvider;