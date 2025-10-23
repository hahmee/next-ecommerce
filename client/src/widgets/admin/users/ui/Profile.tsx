// src/widgets/admin/users/ui/Profile.tsx

// src/widgets/admin/users/ui/Profile.tsx
'use client';

import { ProfileView } from '@/entities/member/ui/ProfileView';
import { useProfile } from '@/features/member/read/model/useProfile';

export default function Profile() {
  const { member, isLoading } = useProfile();
  return <ProfileView member={member} isLoading={isLoading} />;
}
