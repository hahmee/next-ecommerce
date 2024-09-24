export type Category = {
  cno: number;
  cname: string;
  cdesc: string;
  delFlag?: boolean;
  parentCategoryId?: number | null;
  subCategories?: Array<Category>;
};
