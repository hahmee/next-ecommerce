// src/features/auth/model/useLoginForm.ts

﻿// src/features/auth/model/useLoginForm.ts



'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useState } from 'react';

import { fetcher } from '@/shared/http/fetcher';
import { DataResponse } from '@/shared/model/DataResponse';
import { useUserStore } from '@/shared/store/userStore';

export function useLoginForm() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState('user1@aaa.com');
  const [password, setPassword] = useState('1111');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  const submit = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      setMessage('');
      setPending(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ username: email, password }),
        });

        const json: DataResponse<unknown> | null = await res.json().catch(() => null);
        if (!res.ok || json?.success === false) {
          setMessage(json?.message || '로그인 실패');
          return;
        }

        // 로그인 성공 → 사용자 정보 조회
        const me = await fetcher('/api/me', { credentials: 'include' });
        setUser(me);
        router.push('/');
      } catch (error: unknown) {
        setMessage(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
      } finally {
        setPending(false);
      }
    },
    [email, password, router, setUser],
  );

  return {
    email,
    password,
    message,
    pending,
    setEmail,
    setPassword,
    setMessage,
    submit,
    goSignup: () => router.push('/signup'),
  } as const;
}
