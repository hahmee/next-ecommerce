import {Product} from "@/interface/Product";
import {DataResponse} from "@/interface/DataResponse";
import {Review} from "@/interface/Review";
import {Category} from "@/interface/Category";

const BACKEND_URL = typeof window === 'undefined' ? process.env.BACKEND_URL : process.env.NEXT_PUBLIC_BACKEND_URL;


// accessToken이 필요가 없어서 (만료되는지 확인안해도됨)
// server, client fetcher 사용 안
export const getPublicProduct = async ({queryKey,}: { queryKey: [string, string]}): Promise<Product> => {
  const [, pno] = queryKey;

  const res = await fetch(`${BACKEND_URL}/api/public/products/${pno}`, {
    method: 'GET',
    next: { revalidate: 60, tags: ['productSingle', pno] }, // ISR 캐싱
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch product ${pno}`);
  }

  const data: DataResponse<Product> = await res.json();

  return await data.data;


};

export const getPublicReviews = async ({queryKey,}: { queryKey: [string, string]}): Promise<Array<Review>> => {
  const [, id] = queryKey;

  const res = await fetch(`${BACKEND_URL}/api/public/reviews/list/${id}`, {
    method: 'GET',
    next: {revalidate: 60, tags: ['reviews', id]}, // isr 캐싱
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch review ${id}`);
  }

  const data: DataResponse<Array<Review>> = await res.json();

  return await data.data;
};


export const getPublicNewProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BACKEND_URL}/api/public/products/newProductList`, {
    method: "GET",
    cache: "no-store", //SSR (최신)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch new products");
  }

  const data: DataResponse<Product[]> = await res.json();

  return data.data;
};

export const getPublicFeaturedProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BACKEND_URL}/api/public/products/featuredProductList`, {
    method: "GET",
    cache: "no-store", //SSR (최신)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch featured products");
  }

  const data: DataResponse<Product[]> = await res.json();
  return data.data;
};


export const getPublicExpertProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BACKEND_URL}/api/public/products/expertProducts`, {
    method: "GET",
    cache: "no-store", //SSR (최신)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch expert products");
  }

  const data: DataResponse<Product[]> = await res.json();
  return data.data;
};

export const getPublicCategories = async (): Promise <Category[]> => {
  const res = await fetch(`${BACKEND_URL}/api/public/category/list`, {
    method: "GET",
    cache: "no-store", //SSR (최신)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data: DataResponse<Category[]> = await res.json();
  return data.data;
};


export const getPublicCategory = async ({queryKey}: { queryKey: [string, string]}): Promise <Category> => {
  const [_, cno] = queryKey;
  const res = await fetch(`${BACKEND_URL}/api/public/category/${cno}`, {
    method: "GET",
    cache: "no-store", //SSR (최신)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  const data: DataResponse<Category> = await res.json();

  return data.data;
};


export const getPublicProductList = async ({
                                             queryKey,
                                             page,
                                             row,
                                             categoryId,
                                             colors,
                                             productSizes,
                                             minPrice,
                                             maxPrice,
                                             order,
                                             query,
                                           }: {
      queryKey: [string, string, string[], string[], string, string, string, string];
      page: number;
      row: number;
      categoryId: string;
      colors: string | string[] | undefined;
      productSizes: string | string[] | undefined;
      minPrice: string;
      maxPrice: string;
      order: string;
      query: string;
}): Promise<any> => {

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", row.toString());
  params.append("categoryId", categoryId);
  params.append("minPrice", minPrice.toString());
  params.append("maxPrice", maxPrice.toString());
  params.append("order", order);
  params.append("query", query);

  if (colors) {
    if (Array.isArray(colors)) {
      colors.forEach((color) => params.append("color", color));
    } else {
      params.append("color", colors);
    }
  }

  if (productSizes) {
    if (Array.isArray(productSizes)) {
      productSizes.forEach((productSize) => params.append("productSize", productSize));
    } else {
      params.append("productSize", productSizes);
    }
  }


  const res = await fetch(`${BACKEND_URL}/api/public/products/list?${params.toString()}`, {
    method: "GET",
    next: { revalidate: 60, tags: ['products'] }, //ISR을 위해 revalidate 해서 60초마다 페이지 재생성
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category list");
  }

  const data: DataResponse<any> = await res.json();

  return data.data;
};