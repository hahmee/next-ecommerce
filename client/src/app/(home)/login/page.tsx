'use client';

import React from 'react';

import LoginView from '@/features/auth/ui/LoginView';
import { useLoginForm } from '@/features/auth/model/useLoginForm';

export default function LoginPage() {
  const form = useLoginForm();
  return (
    <LoginView
      email={form.email}
      password={form.password}
      message={form.message}
      pending={form.pending}
      onEmail={form.setEmail}
      onPassword={form.setPassword}
      onSubmit={form.submit}
      onMoveSignup={form.goSignup}
    />
  );
}
