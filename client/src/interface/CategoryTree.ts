export interface CategoryTree {
  cno: number;
  cname: string;
  cdesc: string;
  delFlag: boolean;
  subCategories: Array<CategoryTree>;
  uploadFileName: string;
  uploadFileKey: string;
};
