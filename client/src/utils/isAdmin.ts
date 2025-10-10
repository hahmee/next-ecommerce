import { MemberPublic } from '@/interface/MemberPublic';
import { MemberRole } from '@/types/memberRole';

export function isAdmin(user?: MemberPublic | null) {
  if (!user) return false;
  return user.roleNames.some((role) => [MemberRole.ADMIN, MemberRole.MANAGER].includes(role));
}
