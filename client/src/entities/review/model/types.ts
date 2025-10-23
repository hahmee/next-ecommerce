import { Member } from '@/entities/member';
import { Order } from '@/entities/order';

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
