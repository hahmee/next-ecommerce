// src/entities/review/model/types.ts

// src/entities/review/model/types.ts

import { Member } from '@/entities/member/model/Member';
import { Order } from '@/entities/order/model/types';

export interface Review {
  rno?: number;
  content: string;
  rating: number;
  orderId: string;
  order: Order | null;
  pno: number;
  oid: number;
  owner: Member | null;
  createdAt: string | null;
  updatedAt: string | null;
}
