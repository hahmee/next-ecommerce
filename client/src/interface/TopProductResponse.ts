import {ColorTag} from "@/interface/ColorTag";

export interface TopProductResponse {
  pno: number;
  pname: string;
  size: string;
  color: ColorTag;
  quantity: number;
  total: number;
  change: number;
  grossSales: number;
  thumbnail: string;
}
