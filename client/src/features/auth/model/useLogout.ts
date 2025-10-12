// src/hooks/useLogout.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { authApi } from '@/entities/member/model/authService';
import { useUserStore } from '@/features/common/store/userStore';

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();
  const resetUser = useUserStore((s) => s.resetUser);

  const { mutate: logout, isPending } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      resetUser();
      qc.clear();
      router.push('/login');
      router.refresh();
      toast.success('로그아웃 되었습니다.');
    },
    onError: (err) => {
      resetUser();
      qc.clear();
      router.push('/login');
      router.refresh();
    },
  });

  return { logout, isPending };
}
