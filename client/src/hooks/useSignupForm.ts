'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import {Member} from "@/interface/Member";
import {DataResponse} from "@/interface/DataResponse";
import {isBlank} from "@/utils/validation";

export function useSignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const validate = useCallback(() => {
    if (isBlank(email)) return '이메일을 입력하세요.';
    if (isBlank(nickname)) return '닉네임을 입력하세요.';
    if (isBlank(password)) return '비밀번호를 입력하세요.';
    return '';
  }, [email, nickname, password]);

  const submit = useCallback(async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setMessage('');
    const err = validate();
    if (err) {
      setMessage(err);
      return;
    }

    setPending(true);
    try {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('nickname', nickname);
      formData.set('password', password);
      formData.set('social', 'false');
      formData.set('roleNames', 'USER');

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/register`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const json: DataResponse<Member> = await res.json();
      if (!res.ok || json?.success === false) {
        setMessage(json?.message || '회원가입 실패');
        return;
      }
      toast.success('회원가입 되었습니다.');
      router.replace('/login');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : '알 수 없는 에러입니다.');
    } finally {
      setPending(false);
    }
  }, [email, nickname, password, router, validate]);

  return {
    email, nickname, password, pending, message,
    setEmail, setNickname, setPassword, setMessage,
    submit,
    goLogin: () => router.push('/login'),
  } as const;
}
