export type Category = {
  cno: number;
  cname: string;
  cdesc: string;
  delFlag?: boolean;
  parentCategory?: Category;
  subCategories?: Array<Category>;
};
