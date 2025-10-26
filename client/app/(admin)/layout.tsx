import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { authApi, MemberRole } from '@/entities/member';
import { AdminWrapper } from '@/widgets/layout';

const ADMIN_ROLES = [MemberRole.ADMIN, MemberRole.MANAGER, MemberRole.DEMO];

export default async function AdminLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  let me = null;
  try {
    me = await authApi.me();
  } catch {
    redirect('/login?redirect=/admin');
  }

  if (!me) {
    redirect('/login?redirect=/admin');
  }

  const ok = me.roleNames?.some((r) => ADMIN_ROLES.includes(r));
  if (!ok) {
    redirect('/error');
  }

  return <AdminWrapper modal={modal}>{children}</AdminWrapper>;
}
