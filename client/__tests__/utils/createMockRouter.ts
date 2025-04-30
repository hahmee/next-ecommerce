import { NextRouter } from 'next/router';

export function createMockRouter(overrides: Partial<NextRouter> = {}): NextRouter {
    return {
        basePath: '',
        pathname: '/',
        route: '/',
        asPath: '/',
        query: {},
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(), // ✅ 추가!
        prefetch: jest.fn().mockResolvedValue(undefined),
        beforePopState: jest.fn(),
        isFallback: false,
        isReady: true,
        isLocaleDomain: false,
        isPreview: false,
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
        ...overrides,
    };
}
