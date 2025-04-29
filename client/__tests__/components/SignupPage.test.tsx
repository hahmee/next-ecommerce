import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import SignupPage from "@/app/(home)/signup/page";
import {useRouter} from "next/navigation";
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";
import {MemberRole} from "@/types/memberRole";

// fetch 모킹
global.fetch = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
};

describe("SignupPage (state 기반)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it("renders the signup form correctly", () => {
        render(<SignupPage />);
        expect(screen.getByText("사용자 이메일")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("이메일")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("비밀번호")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("닉네임")).toBeInTheDocument();
        expect(screen.getByText("계정이 있으신가요?")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "signUp" })).toBeInTheDocument();
    });

    it("should successfully signup when correct credentials are provided", async () => {
        render(<SignupPage />);

        // 입력값 채움
        fireEvent.change(screen.getByPlaceholderText("이메일"), { target: { value: "user@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("닉네임"), { target: { value: "user123" } });
        fireEvent.change(screen.getByPlaceholderText("비밀번호"), { target: { value: "userpassword" } });

        // fetch 성공 응답 세팅
        const mockMemberData = {
            email: "user@example.com",
            roleNames: [MemberRole.USER],
            nickname: "user123",
            encryptedId: "encryptedId123",
        };
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () =>
                ({ code: 0, data: mockMemberData, success: true, message: "" } as DataResponse<Member>),
        });

        fireEvent.submit(screen.getByTestId("signup-form"));

        // 로그인 페이지로 리다이렉트 됐는지 확인
        await waitFor(() => {
            expect(mockRouter.replace).toHaveBeenCalledWith("/login");
        });
    });
});
