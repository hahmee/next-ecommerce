import { MemberRole } from '@/shared/model/memberRole';

export interface MemberPublic {
  email: string;
  nickname: string;
  roleNames: MemberRole[];
}
