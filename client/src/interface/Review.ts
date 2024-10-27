import {Member} from "@/interface/Member";
import {Order} from "@/interface/Order";

export interface Review {
  rno?: number;
  content: string;
  rating: number;
  orderId: string;
  order: Order | null;
  pno: number;
  oid: number;
  owner: Member | null;
  createdAt:string | null;
  updatedAt: string | null;
}
