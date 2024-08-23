import {MemberRole} from "@/types/memberRole";

export interface Member {
  email: string;
  accessToken?: string;
  nickname?: string;
  password?: string;
  refreshToken?: string;
  roleNames?: [MemberRole];
  social?: false;
}

export type MemberModifyType = Omit<Member, 'social' | 'roleNames' | 'accessToken' | 'refreshToken' | 'error'>;
