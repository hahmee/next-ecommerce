import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render} from '@testing-library/react';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

export const customRender = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // 테스트 환경에서는 재시도를 비활성화
            },
        },
    });

    return render(ui, {
        wrapper: ({children}: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {/*<DndProvider  backend={HTML5Backend}>*/}
-                {children}
                {/*</DndProvider>*/}
            </QueryClientProvider>
        ),
    });
};
