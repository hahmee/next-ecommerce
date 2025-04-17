import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import LoginPage from "@/app/(home)/login/page";
import {MemberRole} from "@/types/memberRole";
import {setCookie} from "@/utils/cookie";
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";
import {useRouter} from "next/navigation";

// fetch 모킹
global.fetch = jest.fn();

jest.mock("@next/third-parties/google", () => ({
    sendGTMEvent: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(), // useRouter를 jest.fn()으로 모킹
}));

jest.mock("@/utils/cookie", () => ({
    setCookie: jest.fn(),
    getCookie: jest.fn(),
}));

const userInfo = {
    email: "user1@aaa.com",
    password: "1111",
};

const mockRouter = {
    replace: jest.fn(), // replace 메서드를 포함하는 객체 생성
    push: jest.fn(), // push 메서드를 포함하는 객체 생성
};

    describe("Login", () => {
        beforeEach(() => {
            jest.clearAllMocks(); // 테스트 전 Mock 초기화
            // setCookie.mockClear();
            // getCookie.mockClear();
            // sendGTMEvent.mockClear();

            (useRouter as jest.Mock).mockReturnValue(mockRouter); // useRouter가 mockRouter를 반환하도록 설정

        });

        it('renders the login form correctly', () => {
            render(<LoginPage/>);
            const labelNode = screen.getByText("사용자 이메일");
            expect(labelNode).toBeInTheDocument();
            expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
            expect(screen.getByText('계정이 없으신가요?')).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "login" })).toBeInTheDocument();
        });

        it('should successfully login when correct credentials are provided', async () => {
            render(<LoginPage/>);

            const emailInput = screen.getByPlaceholderText('이메일');
            const passwordInput = screen.getByPlaceholderText('비밀번호');
            const submitButton = screen.getByRole("button", {name: "login"})

            //이벤트 실행
            fireEvent.change(emailInput, {target: {value: userInfo.email}});
            fireEvent.change(passwordInput, {target: {value: userInfo.password}});

            // mock fetch로 성공 응답 처리
            const mockMemberData = {
                email: userInfo.email,
                roleNames: [MemberRole.USER],
                encryptedId: 'encryptedId123',
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                json: async () => ({code: 0, data: mockMemberData, success: true, message: ""}) as DataResponse<Member>,
            });

            // 로그인 버튼 클릭한다.
            fireEvent.click(submitButton);

            await waitFor(() => {
                // 쿠키가 세팅되었는지 확인
                expect(setCookie).toHaveBeenCalledWith('member', JSON.stringify(mockMemberData));
            });

            console.log("sendGTMEvent 호출 전");

            // await waitFor(() => {
            //     expect(sendGTMEvent).toHaveBeenCalledWith({
            //         event: 'login',
            //         uid: 'encryptedId123',
            //         user_role: MemberRole.USER,
            //         custom_user_id: 'encryptedId123',
            //     });
            // });

            // 사용자가 홈 페이지로 리다이렉트 됐는지 확인
            expect(mockRouter.replace).toHaveBeenCalledWith('/');

        });

        it('should show error message when login fails', async () => {
            render(<LoginPage />);

            const emailInput = screen.getByPlaceholderText('이메일');
            const passwordInput = screen.getByPlaceholderText('비밀번호');
            const submitButton = screen.getByRole("button", {name: "login"})

            fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

            // mock fetch로 실패 응답 처리
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: async () => ({code: 401, success: false, message: "존재하지 않는 계정입니다."}),
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('존재하지 않는 계정입니다.')).toBeInTheDocument();
            });
        });
        it('should redirect to signup page when "계정이 없으신가요?" is clicked', () => {
            render(<LoginPage />);

            const signupLink = screen.getByText('계정이 없으신가요?');
            fireEvent.click(signupLink);

            // signup 페이지로 리다이렉트 됐는지 확인
            expect(mockRouter.push).toHaveBeenCalledWith('/signup');
        });
    });

