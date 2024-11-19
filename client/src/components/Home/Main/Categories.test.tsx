import { render, screen, waitFor } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import Categories from "@/components/Home/Main/Categories";
import {getCategories} from "@/api/adminAPI";

// Mock 처리
jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("@/api/adminAPI", () => ({
    getCategories: jest.fn(),
}));

describe("Categories Component", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전 Mock 초기화
    });

    it("renders loading state initially", () => {
        (useQuery as jest.Mock).mockReturnValue({ isLoading: true });

        render(<Categories />);

        // "Loading..." 메시지가 렌더링되는지 확인
        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    test("renders categories after fetching data", async () => {
        const mockCategories = [
            {
                cno: 57,
                cname: 'ㄴㅇㄹ',
                cdesc: 'ㄴㅇㄹ',
                delFlag: false,
                parentCategoryId: null,
                subCategories: null,
                file: null,
                uploadFileName: 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg',
                uploadFileKey: 'category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg'
            },
            {
                cno: 63,
                cname: 'ㅁㄴㅇㄹ',
                cdesc: 'ㅁㄴㅇㄹ',
                delFlag: false,
                parentCategoryId: null,
                subCategories: [Array],
                file: null,
                uploadFileName: 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë\x8B¤í\x95¨2_ë³µì\x82¬ë³¸-001.png',
                uploadFileKey: 'category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë\x8B¤í\x95¨2_ë³µì\x82¬ë³¸-001.png'
            }
        ];

        // (useQuery as jest.Mock).mockReturnValue({
        //     data: mockCategories,
        //     isLoading: false,
        // });

        (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

        render(<Categories />);

        // 'Loading...' 텍스트가 나타날 때까지 기다림
        expect(await screen.findByText('Loading...')).toBeInTheDocument();


        // 첫 번째 카테고리 검증
        const category1 = await screen.findByText("ㄴㅇㄹ");
        expect(category1).toBeInTheDocument();

        // 두 번째 카테고리 검증
        const category2 = await screen.findByText("ㅁㄴㅇㄹ");
        expect(category2).toBeInTheDocument();
    });

    it("renders empty state when no categories are available", async () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });

        render(<Categories />);

        // 데이터가 없을 때 렌더링 확인
        expect(screen.queryByText(/ㄴㅇㄹ/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/ㅁㄴㅇㄹ/i)).not.toBeInTheDocument();
    });
});

// import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
// import {getCategories} from "@/api/adminAPI";
// import Categories from "@/components/Home/Main/Categories";
// import {render, screen, waitFor} from "@testing-library/react";
//
//
// jest.mock('../../../api/adminAPI', () => ({
//     getCategories: jest.fn(), // Jest mock 함수로 설정
// }));
//
// //defining React Query Wrapper
// const queryClient = new QueryClient({
//     defaultOptions: {  // react-query 전역 설정
//         queries: {
//             refetchOnWindowFocus: false,
//             retryOnMount: true,
//             refetchOnReconnect: false,
//             retry: false,
//         },
//     },
// });
//
// const wrapper = ({ children }: { children: React.ReactNode }) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
// );
// // mocking the response for Car Event Api
// const mockCarDetails = [
//     {
//         cno: 57,
//         cname: 'ㄴㅇㄹ',
//         cdesc: 'ㄴㅇㄹ',
//         delFlag: false,
//         parentCategoryId: null,
//         subCategories: null,
//         file: null,
//         uploadFileName: 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg',
//         uploadFileKey: 'category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg'
//     },
//     {
//         cno: 63,
//         cname: 'ㅁㄴㅇㄹ',
//         cdesc: 'ㅁㄴㅇㄹ',
//         delFlag: false,
//         parentCategoryId: null,
//         subCategories: [Array],
//         file: null,
//         uploadFileName: 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë\x8B¤í\x95¨2_ë³µì\x82¬ë³¸-001.png',
//         uploadFileKey: 'category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë\x8B¤í\x95¨2_ë³µì\x82¬ë³¸-001.png'
//     }
// ];
//
// describe('<Categories/>', () => {
//     // beforeEach test BeforeEach function will run and clear the mock and UseQuery
//     beforeEach(() => {
//         jest.clearAllMocks();
//         queryClient.clear();
//         (getCategories as jest.Mock).mockReturnValueOnce(mockCarDetails);
//     });
//
//     it('render component successfully', async () => {
//         render(<Categories/>, {wrapper});
//
//         await waitFor(() => {
//             expect(getCategories).toHaveBeenCalledTimes(1);
//         });
//
//         await screen.findByText('ㄴㅇㄹ');
//
//     });
//
//
//     // it('should fetch car details data successfully', async () => {
//     //
//     //     (getCategories as jest.Mock).mockResolvedValue({
//     //         data: mockCarDetails,
//     //     });
//     //
//     //     const { result } = renderHook(() => useCarEventDetails(), {wrapper});
//     //
//     //     await waitFor(() => expect(result.current.isLoading).toBe(false));
//     //     expect(result.current.isError).toBe(false);
//     //     expect(result.current.carDetails).toEqual(mockCarDetails);
//     // });
//
//
//
// });