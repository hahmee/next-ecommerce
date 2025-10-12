'use client';

import { useProfile } from '@/features/member/read/model/useProfile';

import { ProfileView } from './ProfileView';

export default function Profile() {
  const { member, isLoading } = useProfile();
  return <ProfileView member={member} isLoading={isLoading} />;
}
