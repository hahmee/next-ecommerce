'use client';


import {useLoginForm} from "@/hooks/useLoginForm";
import React from "react";
import LoginView from "@/components/Home/Auth/LoginView";

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
