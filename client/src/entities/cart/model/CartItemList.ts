import { ColorTag } from '@/interface/ColorTag';

export interface CartItemList {
  cino: number;
  qty: number;
  pno: number;
  pname: string;
  price: number;
  imageFile: string;
  size: string;
  color: ColorTag;
  sellerEmail: string;
}
