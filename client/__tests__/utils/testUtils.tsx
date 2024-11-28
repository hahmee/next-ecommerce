import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { Inter } from 'next/font/google';
import { Router } from 'next/router'; // next/router에서 RouterContext를 가져옵니다.

const inter = Inter({ subsets: ['latin'] });

export const customRender = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // 테스트 환경에서는 재시도를 비활성화
            },
        },
    });

    // Mock App Router Context
    const appRouterContext = {
        basePath: '',
        pathname: '/',
        query: {},
        asPath: '/',
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
        beforePopState: jest.fn(),
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
    };

    return render(ui, {
        wrapper: ({children}: { children: React.ReactNode }) => (
            <html lang="en">
            <body className={inter.className} suppressHydrationWarning={true}>
            <QueryClientProvider client={queryClient}>
                {/*<Router value={appRouterContext}>*/}
                    {children}
            </QueryClientProvider>
            </body>
            </html>
        ),
    });
};
