import {ColorTag} from "@/interface/ColorTag";

export interface CartItem {
  email: string;
  pno: number;
  qty: number;
  cino?: number;
  color: ColorTag;
  size: string;
}
