import { MemberRole } from '@/types/memberRole';

export interface MemberPublic {
  email: string;
  nickname: string;
  roleNames: MemberRole[];
}
