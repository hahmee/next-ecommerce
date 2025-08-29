'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Member } from '@/interface/Member';
import { useUserStore } from '@/store/userStore';

const GuestAuthButtons = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const { user } = useUserStore();

  const showLoginButtons = !user && !isAuthPage;

  return (
    <div>
      {showLoginButtons && (
        <div className="flex gap-2">
          <Link href="/login">
            <button
              type="button"
              className="w-25 bg-ecom text-white p-2 rounded-md text-center disabled:bg-pink-200 disabled:cursor-not-allowed"
            >
              로그인
            </button>
          </Link>

          <Link href="/signup">
            <button
              type="button"
              className="w-25 bg-ecom text-white p-2 rounded-md text-center disabled:bg-pink-200 disabled:cursor-not-allowed"
            >
              회원가입
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GuestAuthButtons;
