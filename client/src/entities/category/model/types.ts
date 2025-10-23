

export interface Category {
  cno: number;
  cname: string;
  cdesc: string;
  delFlag?: boolean;
  parentCategoryId?: number | null;
  subCategories?: Array<Category>;
  file?: string | null;
  uploadFileName?: string | null;
  uploadFileKey?: string | null;
}
