'use client';

import { FormEvent, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { fetcher } from '@/utils/fetcher/fetcher';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('user1@aaa.com');
  const [password, setPassword] = useState<string>('1111');
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const { setUser } = useUserStore();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password,
        }),
      });

      // 항상 JSON 파싱 시도
      const json = await response.json().catch(() => null);

      // 실패 처리
      if (!response.ok || json?.success === false) {
        setMessage(json?.message || '로그인 실패');
        return;
      }

      // 성공 시 사용자 정보 조회
      const user = await fetcher('/api/me', { credentials: 'include' });
      setUser(user);

      router.push('/');
    } catch (error) {
      console.error('로그인 처리 중 에러', error);
      setMessage('알 수 없는 에러가 발생했습니다.');
    }
  };

  const handleSignup = () => router.push('/signup');

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
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="true"
            className="ring-2 ring-gray-300 rounded-md p-4"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="bg-ecom text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          type="submit"
          aria-label="login"
          data-testid="login-submit"
        >
          로그인
        </button>

        <div className="text-sm underline cursor-pointer" onClick={handleSignup}>
          계정이 없으신가요?
        </div>

        {message && <div className="text-red-600 text-sm">{message}</div>}
      </form>
    </div>
  );
}
