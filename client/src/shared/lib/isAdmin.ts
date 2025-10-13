import { MemberRole } from '@/shared/model/memberRole';
import { MemberPublic } from '@/entities/member/model/MemberPublic';

export function isAdmin(user?: MemberPublic | null) {
  if (!user) return false;
  return user.roleNames.some((role) => [MemberRole.ADMIN, MemberRole.MANAGER].includes(role));
}
