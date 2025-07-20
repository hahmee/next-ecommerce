import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import LoginPage from "@/app/(home)/login/page";
import {MemberRole} from "@/types/memberRole";
import {useRouter} from "next/navigation";

// mock fetch
global.fetch = jest.fn();

// mock fetcher
// 실제 fetcher를 호출하지 않고, 테스트에서 원하는 유저 객체를 응답하게 함
jest.mock('@/utils/fetcher/fetcher', () => ({
  fetcher: jest.fn(),
}));

// mock zustand
jest.mock('@/store/userStore', () => ({
  useUserStore: jest.fn(),
}));

// mock GTM
// sendGTMEvent는 실제 GTM에 전송되면 안 되기 때문에 가짜 함수로 대체
const sendGTMEvent = jest.fn();
jest.mock("@next/third-parties/google", () => ({
  sendGTMEvent,
}));

// mock router
// 페이지 이동 (router.push/replace)을 추적할 수 있도록 가짜 router 객체 설정
const mockRouter = {
  replace: jest.fn(), // jest.fn()으로 가짜 함수 생성
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// mock user
const mockUser = {
  email: "user1@aaa.com",
  roleNames: [MemberRole.USER],
  encryptedId: "encryptedId123",
  password: "1111",
};

const mockSetUser = jest.fn();

describe("Login", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // 테스트 전 Mock 초기화

      // useRouter()는 mockRouter 객체를 반환하게 설정
      (useRouter as jest.Mock).mockReturnValue(mockRouter);

      // useUserStore()는 내부에 setUser(mock 함수)를 가진 객체를 반환하도록 설정
      const { useUserStore } = require("@/store/userStore");
      useUserStore.mockReturnValue({ setUser: mockSetUser });
    });

    it('renders the login form correctly', () => {
      render(<LoginPage/>);
      expect(screen.getByText("사용자 이메일")).toBeInTheDocument();
      expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
      expect(screen.getByText('계정이 없으신가요?')).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "login" })).toBeInTheDocument();
    });

  it("should successfully login with correct credentials", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("이메일"), {
      target: { value: mockUser.email },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
      target: { value: mockUser.password },
    });

    // fetch login 응답 mocking
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ code: 0, data: {}, success: true }),
    });

    // /api/me 요청 결과 mocking
    const { fetcher } = await import('@/utils/fetcher/fetcher');
    (fetcher as jest.Mock).mockResolvedValueOnce(mockUser);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    //로그인 성공 후 상태 저장, 페이지 이동 확인
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });


  it("should show error message when login fails", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("이메일"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
      target: { value: "wrongpass" },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 401, success: false, message: "로그인 실패" }),
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("알 수 없는 에러입니다.")).toBeInTheDocument();
    });
  });

  it('should navigate to signup page when "계정이 없으신가요?" is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("계정이 없으신가요?"));
    expect(mockRouter.push).toHaveBeenCalledWith("/signup");
  });

});

