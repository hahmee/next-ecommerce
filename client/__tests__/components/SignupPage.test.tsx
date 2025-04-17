import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import SignupPage from "@/app/(home)/signup/page";
import {useRouter} from "next/navigation";
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";
import {MemberRole} from "@/types/memberRole";

// fetch 모킹
global.fetch = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(), // useRouter를 jest.fn()으로 모킹
}));

const mockRouter = {
    replace: jest.fn(), // replace 메서드를 포함하는 객체 생성
    push: jest.fn(), // push 메서드를 포함하는 객체 생성
};

describe("Signup", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전 Mock 초기화
        (useRouter as jest.Mock).mockReturnValue(mockRouter); // useRouter가 mockRouter를 반환하도록 설정
    });

    it('renders the signup form correctly', () => {
        render(<SignupPage/>);

        const labelNode = screen.getByText("사용자 이메일");
        expect(labelNode).toBeInTheDocument();
        expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('닉네임')).toBeInTheDocument();
        expect(screen.getByText('계정이 있으신가요?')).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "signUp"})).toBeInTheDocument();

    });

    // 폼 제출 테스트
    it('should successfully signup when correct credentials are provided', async () => {

        render(<SignupPage/>);

        const emailInput = screen.getByPlaceholderText('이메일');
        const passwordInput = screen.getByPlaceholderText('비밀번호');
        const nicknameInput = screen.getByPlaceholderText('닉네임');
        const submitButton = screen.getByRole("button", {name: "signUp"});

        //이벤트 실행
        fireEvent.change(emailInput, {target: {value: 'user@example.com'}});
        fireEvent.change(nicknameInput, {target: {value: 'user123'}});
        fireEvent.change(passwordInput, {target: {value: 'userpassword'}});

        // mock fetch로 성공 응답 처리
        const mockMemberData = {
            email: "user@example.com",
            roleNames: [MemberRole.USER],
            nickname: "user123",
            encryptedId: 'encryptedId123',
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({code: 0, data: mockMemberData, success: true, message: ""}) as DataResponse<Member>
        });

        // 회원가입 클릭 및 상태 업데이트 처리
        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            fireEvent.click(submitButton);
        });
        // 사용자가 로그인 페이지로 리다이렉트 됐는지 확인
        // expect(mockRouter.replace).toHaveBeenCalledWith('/login');
        // 사용자가 로그인 페이지로 리다이렉트 됐는지 확인
        await waitFor(() => {
            // mockRouter.replace가 호출되었는지 확인
            expect(mockRouter.replace).toHaveBeenCalledWith('/login');
        });

    });

});
