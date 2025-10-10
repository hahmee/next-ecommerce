'use client';

import SignupView from '@/components/Home/Auth/SignupView';
import { useSignupForm } from '@/hooks/auth/useSignupForm';

export default function SignupPage() {
  const form = useSignupForm();
  return (
    <SignupView
      email={form.email}
      nickname={form.nickname}
      password={form.password}
      pending={form.pending}
      message={form.message}
      onEmail={form.setEmail}
      onNickname={form.setNickname}
      onPassword={form.setPassword}
      onSubmit={form.submit}
      onMoveLogin={form.goLogin}
    />
  );
}
