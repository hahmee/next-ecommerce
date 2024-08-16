export interface Member {
  email: string;
  accessToken?: string;
  nickname?: string;
  password?: string;
  refreshToken?: string;
  roleNames?: [string];
  social?: false;
  // error?: string;
}

export type MemberModifyType = Omit<Member, 'social' | 'roleNames' | 'accessToken' | 'refreshToken' | 'error'>;
