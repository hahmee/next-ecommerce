// src/shared/lib/isAdmin.ts



import { MemberRole } from '@/entities/member/consts/MemberRole';
import { MemberPublic } from '@/entities/member/model/MemberPublic';

export function isAdmin(user?: MemberPublic | null) {
  if (!user) return false;
  return user.roleNames.some((role) => [MemberRole.ADMIN, MemberRole.MANAGER].includes(role));
}
