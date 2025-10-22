// src/entities/cart/model/CartItem.ts

﻿// src/entities/cart/model/CartItem.ts

import { ColorTag } from '@/shared/model/ColorTag';

export interface CartItem {
  email: string;
  pno: number;
  qty: number;
  cino?: number;
  color: ColorTag;
  size: string;
  sellerEmail: string;
}
