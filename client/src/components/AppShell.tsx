import { Member } from '@/interface/Member';

export default function AppShell({
  user,
  children,
}: {
  user: Member;
  accessToken?: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
