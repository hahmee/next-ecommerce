import { MemberRole } from '@/entities/member';
import { MemberPublic } from '@/entities/member';

export function isAdmin(user?: MemberPublic | null) {
  if (!user) return false;
  return user.roleNames.some((role) => [MemberRole.ADMIN, MemberRole.MANAGER].includes(role));
}
