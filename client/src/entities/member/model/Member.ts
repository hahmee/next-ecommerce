// src/entities/member/model/Member.ts



import { MemberRole } from '@/entities/member/consts/MemberRole';

export interface Member {
  email: string;
  accessToken: string;
  nickname: string;
  password: string;
  refreshToken: string;
  roleNames: MemberRole[];
  social: false;
  encryptedId: string;
  createdAt: string;
  updatedAt: string;
}

export type MemberModifyType = Omit<
  Member,
  'social' | 'roleNames' | 'accessToken' | 'refreshToken' | 'error'
>;
