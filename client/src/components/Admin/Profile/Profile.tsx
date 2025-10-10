'use client';

import { useProfile } from '@/hooks/home/member/useProfile';

import { ProfileView } from './ProfileView';

export default function Profile() {
  const { member, isLoading } = useProfile();
  return <ProfileView member={member} isLoading={isLoading} />;
}
