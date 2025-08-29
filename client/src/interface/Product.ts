import { SalesStatus } from '@/types/salesStatus';
import { FileDTO } from '@/interface/FileDTO';
import { ColorTag } from '@/interface/ColorTag';
import { Category } from '@/interface/Category';
import { Member } from '@/interface/Member';

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
