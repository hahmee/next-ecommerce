import {render, screen} from "@testing-library/react";
import {useQuery} from "@tanstack/react-query";
import Categories from "@/components/Home/Main/Categories";
// Jest: 테스트 환경 제공 + mocking
// Mock 처리
jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("@/apis/adminAPI", () => ({
    getCategories: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
    })),
    usePathname: jest.fn(() => "/"),
    useSearchParams: jest.fn(() => new URLSearchParams("")),
}));

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

describe("Categories 컴포넌트", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전 Mock 초기화
    });

    // [2] React Testing Library: 실제 테스트 동작 부분
    it("초기에는 로딩 상태를 렌더링한다", async () => {
        (useQuery as jest.Mock).mockReturnValue({ isLoading: true }); // useQuery를 썼을 때 {isLoading:true} 로 반환하도록
        render(<Categories />);
    });

    it("데이터를 받아오면 카테고리 목록을 보여준다", async () => {
        // Given
        (useQuery as jest.Mock).mockReturnValue({
            data: mockCategories,
            isLoading: false,
        });

        //When
        render(<Categories />);

        //Then
        // 첫 번째 카테고리명 체크
        const category1 = await screen.findByText("ㄴㅇㄹ");
        expect(category1).toBeInTheDocument();

        // 두 번째 카테고리명 체크
        const category2 = await screen.findByText("ㅁㄴㅇㄹ");
        expect(category2).toBeInTheDocument();
    });

    it("카테고리 데이터가 없으면 아무것도 렌더링하지 않는다", async () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });

        render(<Categories />);

        // 데이터 없을 때 카테고리명들이 안 나와야 함
        expect(screen.queryByText(/ㄴㅇㄹ/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/ㅁㄴㅇㄹ/i)).not.toBeInTheDocument();
    });
});
