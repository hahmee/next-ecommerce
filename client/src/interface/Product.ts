export interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;
  uploadFileNames: string[] | null;
  brand: string;
  category: string;
  sku: string;
  inStock: boolean;
  refundPolicy: string;
  changePolicy: string;
  files: string[] | null;
}
