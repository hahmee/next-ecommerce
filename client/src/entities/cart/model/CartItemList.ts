// src/entities/cart/model/CartItemList.ts

// src/entities/cart/model/CartItemList.ts

import { ColorTag } from '@/shared/model/ColorTag';

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
