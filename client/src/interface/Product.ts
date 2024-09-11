import {SalesStatus} from "@/types/salesStatus";
import {FileDTO} from "@/interface/FileDTO";
import {ColorTag} from "@/interface/ColorTag";

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
  colorList: Array<ColorTag>;
  sku: string;
  salesStatus: SalesStatus;
  refundPolicy: string;
  changePolicy: string;
  files:Array<FileDTO<string>>  | null;
}
