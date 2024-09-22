export type Category = {
  cno: number;
  cname: string;
  cdesc: string;
  delFlag?: boolean;
  parentCategory?: Category | null;
  subCategories?: Array<Category>;
};
