import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import SignupPage from "@/app/(home)/signup/page";
import {useFormState, useFormStatus} from "react-dom";
import {redirect} from "next/navigation";

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(), // useRouter를 jest.fn()으로 모킹
    redirect: jest.fn(),
}));

jest.mock("react-dom", () => {
    const originalModule = jest.requireActual("react-dom");

    return {
        ...originalModule, // 기존의 react-dom 모듈 유지
        useFormState: jest.fn(), // 필요한 함수만 모킹
        useFormStatus: jest.fn(), // 필요한 함수만 모킹
    };
});

// const mockSubmit = jest.fn();


describe("Signup", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전 Mock 초기화

        // useFormState와 useFormStatus의 반환값 설정
        (useFormState as jest.Mock).mockReturnValue([
            {
                nickname: "user123",
                email: "user@example.com",
                password: "userpassword",
            },
            jest.fn(), // setState 모의 함수
        ]);

        (useFormStatus as jest.Mock).mockReturnValue({ pending: false });
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
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(nicknameInput, {target: {value: 'user123'}});
        fireEvent.change(passwordInput, {target: {value: 'userpassword'}});

        // 회원가입 클릭한다.
        fireEvent.click(submitButton);

        // await waitFor(() => {
        //     expect(mockSubmit).toHaveBeenCalledTimes(1);
        // });

        // // 사용자가 로그인 페이지로 리다이렉트 됐는지 확인
        expect(redirect).toHaveBeenCalledWith("/login");

    });



});
