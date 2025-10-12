import { MemberRole } from '@/entities/common/model/memberRole';

export interface MemberPublic {
  email: string;
  nickname: string;
  roleNames: MemberRole[];
}
