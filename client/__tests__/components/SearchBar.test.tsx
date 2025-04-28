import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SearchBar from "@/components/Home/SearchBar";
import { useRouter } from "next/navigation";

// Next.js 내비게이션 훅 모킹 (한글 설명)
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(() => "/list"), // 현재 경로 반환
    useSearchParams: jest.fn(() => new URLSearchParams("query=example")), // URLSearchParams 반환
    useRouter: jest.fn(() => ({
        push: jest.fn(), // push 함수 모킹
    })),
}));

jest.mock("@next/third-parties/google", () => ({
    sendGTMEvent: jest.fn(),
}));

const mockRouter = {
    replace: jest.fn(), // replace 함수 모킹
    push: jest.fn(), // push 함수 모킹
};

describe("SearchBar 컴포넌트", () => {

    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전에 Mock 초기화
        (useRouter as jest.Mock).mockReturnValue(mockRouter); // useRouter가 mockRouter를 반환하도록 설정
    });

    it("입력창과 버튼이 제대로 렌더링된다", () => {
        render(<SearchBar />);
        const input = screen.getByPlaceholderText("Search");
        const button = screen.getByRole("button");

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it("URL의 query 파라미터가 input에 기본값으로 들어간다", () => {
        render(<SearchBar />);
        const input = screen.getByPlaceholderText("Search") as HTMLInputElement;
        expect(input.value).toBe("example");
    });

    it("입력창에 값을 입력하면 값이 업데이트된다", () => {
        render(<SearchBar />);
        const input = screen.getByPlaceholderText("Search") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "새 키워드" } });
        expect(input.value).toBe("새 키워드");
    });

    it("폼 제출 시 올바른 URL로 이동한다", async () => {
        render(<SearchBar />);
        const input = screen.getByPlaceholderText("Search");
        const button = screen.getByRole("button");
        fireEvent.change(input, { target: { value: "test" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith("/list?query=test");
        });
    });
});
