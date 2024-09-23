export type Category = {
  cno: number;
  cname: string;
  cdesc: string;
  delFlag?: boolean;
  // parentCategory?: Category | null;
  parentCategoryId?: number | null;
  subCategories?: Array<Category>;
};
