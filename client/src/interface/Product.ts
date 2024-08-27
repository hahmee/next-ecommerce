import {SalesStatus} from "@/types/salesStatus";

export interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;
  uploadFileNames: string[] | null;
  brand: string;
  categoryList: string[];
  sku: string;
  salesStatus: SalesStatus;
  refundPolicy: string;
  changePolicy: string;
  files: string[] | null;
}
