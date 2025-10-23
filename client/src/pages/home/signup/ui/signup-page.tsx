// src/pages/home/signup/ui/signup-page.tsx



'use client';

import { useSignupForm } from '@/features/auth/model/useSignupForm';
import SignupView from '@/features/auth/ui/SignupView';

export function SignupPage() {
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
