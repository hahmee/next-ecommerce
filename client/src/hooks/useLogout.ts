// src/hooks/useLogout.ts
'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/userStore';
import { authApi } from '@/libs/services/authApi';

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
