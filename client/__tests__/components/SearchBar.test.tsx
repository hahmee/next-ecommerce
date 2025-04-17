import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import SearchBar from "@/components/Home/SearchBar";
import {useRouter} from "next/navigation";

// Next.js 내비게이션 훅 모킹
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(() => "/list"), // pathname 반환
    useSearchParams: jest.fn(() => new URLSearchParams("query=example")), // URLSearchParams 반환
    useRouter: jest.fn(() => ({
        push: jest.fn(), // push 함수 모킹
    })),
}));

jest.mock("@next/third-parties/google", () => ({
    sendGTMEvent: jest.fn(),
}));

const mockRouter = {
    replace: jest.fn(), // replace 메서드를 포함하는 객체 생성
    push: jest.fn(), // push 메서드를 포함하는 객체 생성
};

describe("SearchBar Component", () => {

    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전 Mock 초기화
        (useRouter as jest.Mock).mockReturnValue(mockRouter); // useRouter가 mockRouter를 반환하도록 설정
    });


    it("renders the input and button correctly", () => {
        render(<SearchBar />);
        const input = screen.getByPlaceholderText("Search");
        const button = screen.getByRole("button");

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it("pre-fills the input with `query` parameter from URL", () => {
        render(<SearchBar />);

        const input = screen.getByPlaceholderText("Search") as HTMLInputElement;

        expect(input.value).toBe("example");
    });

    it("updates the input value when typing", () => {
        render(<SearchBar />);

        const input = screen.getByPlaceholderText("Search") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "new keyword" } });

        expect(input.value).toBe("new keyword");
    });

    it("submits the form and navigates to the correct URL", async () => {

        render(<SearchBar />);

        const input = screen.getByPlaceholderText("Search");
        const button = screen.getByRole("button");

        fireEvent.change(input, { target: { value: "shoes" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith("/list?query=shoes");
        });
    });
});
