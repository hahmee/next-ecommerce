// src/entities/member/model/MemberPublic.ts

import { MemberRole } from '@/entities/member/consts/MemberRole';

export interface MemberPublic {
  email: string;
  nickname: string;
  roleNames: MemberRole[];
}
