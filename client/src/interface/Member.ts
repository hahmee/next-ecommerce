import {MemberRole} from "@/types/memberRole";

export interface Member {
  email: string;
  accessToken: string;
  nickname: string;
  password: string;
  refreshToken: string;
  roleNames: MemberRole[];
  social: false;
  encryptedId: string;
}

export type MemberModifyType = Omit<Member, 'social' | 'roleNames' | 'accessToken' | 'refreshToken' | 'error'>;
