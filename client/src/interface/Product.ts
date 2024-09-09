import {SalesStatus} from "@/types/salesStatus";
import {FileDTO} from "@/interface/FileDTO";

export interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;
  uploadFileNames: FileDTO<string>[] | null;
  uploadFileKeys: FileDTO<string>[] | null;
  // uploadFileNames: string[] | null;
  // uploadFileKeys: string[] | null;
  brand: string;
  categoryList: string[];
  sku: string;
  salesStatus: SalesStatus;
  refundPolicy: string;
  changePolicy: string;
  files: FileDTO<string>[] | null;
  // files: string[] | null;
}
