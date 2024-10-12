import {Member} from "@/interface/Member";

export interface Review {
  rno?: number;
  content: string;
  rating: number;
  orderId: string;
  // product: Product;
  pno: number;
  oid: number;
  owner: Member | null;
}
