import {MemberRole} from "@/types/memberRole";
import {MemberPublic} from "@/interface/MemberPublic";

export function isAdmin(user?: MemberPublic | null) {
  if (!user) return false;
  return user.roleNames.some((role) =>
    [MemberRole.ADMIN, MemberRole.MANAGER].includes(role),
  );
}