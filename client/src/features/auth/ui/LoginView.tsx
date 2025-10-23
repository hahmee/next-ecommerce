'use client';

import { FormEvent } from 'react';

type Props = {
  email: string;
  password: string;
  message: string;
  pending: boolean;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onMoveSignup: () => void;
};

export function LoginView({
  email,
  password,
  message,
  pending,
  onEmail,
  onPassword,
  onSubmit,
  onMoveSignup,
}: Props) {
  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">로그인</h1>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">사용자 이메일</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="이메일"
            className="ring-2 ring-gray-300 rounded-md p-4"
            onChange={(e) => onEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">비밀번호</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="비밀번호"
            autoComplete="current-password"
            className="ring-2 ring-gray-300 rounded-md p-4"
            onChange={(e) => onPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="bg-ecom text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          type="submit"
          aria-label="login"
          data-testid="login-submit"
          disabled={pending}
        >
          로그인
        </button>

        <div className="text-sm underline cursor-pointer" onClick={onMoveSignup}>
          계정이 없으신가요?
        </div>

        {message && <div className="text-red-600 text-sm">{message}</div>}
      </form>
    </div>
  );
}
