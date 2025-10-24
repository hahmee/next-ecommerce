import { Category } from '@/entities/category';
import { Member } from '@/entities/member';
import { SalesStatus } from '@/entities/product';
import { FileDTO } from '@/entities/product';
import { ColorTag } from '@/shared/model/ColorTag';

export interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;
  uploadFileNames: Array<FileDTO<string>> | null;
  uploadFileKeys: Array<FileDTO<string>> | null;
  // brand: string;
  sizeList: string[];
  colorList: Array<ColorTag>;
  sku: string;
  salesStatus: SalesStatus;
  refundPolicy: string;
  changePolicy: string;
  categoryId: number;
  files: Array<FileDTO<string>> | null;
  // 추가..
  averageRating: number | null;
  reviewCount: number | null;
  category: Category | null; // 최하위 카테고리
  owner: Member;
}

export interface Params {
  key: string;
  value: string;
}
