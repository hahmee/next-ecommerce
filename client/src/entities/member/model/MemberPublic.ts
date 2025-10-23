import { MemberRole } from '@/entities/member';

export interface MemberPublic {
  email: string;
  nickname: string;
  roleNames: MemberRole[];
}
