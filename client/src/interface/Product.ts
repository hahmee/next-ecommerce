import {SalesStatus} from "@/types/salesStatus";
import {FileDTO} from "@/interface/FileDTO";

export interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;
  uploadFileNames: Array<FileDTO<string>> | null;
  uploadFileKeys: Array<FileDTO<string>> | null;
  brand: string;
  categoryList: string[];
  sizeList: string[];
  colorList: string[];
  sku: string;
  salesStatus: SalesStatus;
  refundPolicy: string;
  changePolicy: string;
  files:Array<FileDTO<string>>  | null;
}
