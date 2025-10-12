import { MemberPublic } from '@/entities/member/model/MemberPublic';
import { MemberRole } from '@/entities/common/model/memberRole';

export function isAdmin(user?: MemberPublic | null) {
  if (!user) return false;
  return user.roleNames.some((role) => [MemberRole.ADMIN, MemberRole.MANAGER].includes(role));
}
