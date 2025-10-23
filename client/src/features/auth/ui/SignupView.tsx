'use client';

import { FormEvent } from 'react';

type Props = {
  email: string;
  nickname: string;
  password: string;
  pending: boolean;
  message: string;
  onEmail: (v: string) => void;
  onNickname: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onMoveLogin: () => void;
};

export function SignupView({
  email,
  nickname,
  password,
  pending,
  message,
  onEmail,
  onNickname,
  onPassword,
  onSubmit,
  onMoveLogin,
}: Props) {
  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={onSubmit} data-testid="signup-form">
        <h1 className="text-2xl font-semibold">회원가입</h1>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">사용자 이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            className="ring-2 ring-gray-300 rounded-md p-4"
            required
            value={email}
            onChange={(e) => onEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">닉네임</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            className="ring-2 ring-gray-300 rounded-md p-4"
            required
            value={nickname}
            onChange={(e) => onNickname(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            className="ring-2 ring-gray-300 rounded-md p-4"
            required
            value={password}
            onChange={(e) => onPassword(e.target.value)}
          />
        </div>

        <div className="text-sm underline cursor-pointer" onClick={onMoveLogin}>
          계정이 있으신가요?
        </div>

        <button
          className="bg-ecom text-white p-2 rounded-md disabled:cursor-not-allowed disabled:bg-pink-200"
          disabled={pending}
          aria-label="signUp"
          type="submit"
        >
          회원가입
        </button>

        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
}
