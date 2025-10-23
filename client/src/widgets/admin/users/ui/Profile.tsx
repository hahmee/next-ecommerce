'use client';

import { ProfileView } from '@/entities/member';
import { useProfile } from '@/features/member/read';

export function Profile() {
  const { member, isLoading } = useProfile();
  return <ProfileView member={member} isLoading={isLoading} />;
}
