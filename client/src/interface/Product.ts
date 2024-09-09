import {SalesStatus} from "@/types/salesStatus";
import {FileDTO} from "@/interface/FileDTO";

export interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;
  uploadFileNames: FileDTO<any>[] | null;
  uploadFileKeys: FileDTO<any>[] | null;
  // uploadFileNames: string[] | null;
  // uploadFileKeys: string[] | null;
  brand: string;
  categoryList: string[];
  sku: string;
  salesStatus: SalesStatus;
  refundPolicy: string;
  changePolicy: string;
  files: FileDTO<any>[] | null;
  // files: string[] | null;
}
