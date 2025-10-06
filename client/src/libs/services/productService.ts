
import type { Product } from '@/interface/Product';
import type { Category } from '@/interface/Category';
import { fetcher } from '@/utils/fetcher/fetcher';

export const productApi = {
  getProduct: (id: string) =>
    fetcher<Product>(`/api/products/${id}`, {
      method: 'GET',
      credentials: 'include',
    }),

  getCategoryPaths: (id: string) =>
    fetcher<Category[]>(`/api/category/paths?id=${id}`, {
      method: 'GET',
      credentials: 'include',
    }),

  getCategories: () =>
    fetcher<Category[]>(`/api/category/list`, {
      method: 'GET',
      credentials: 'include',
    }),

  create: (form: FormData) =>
    fetcher<Product>(`/api/products`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    }),

  update: (id: string, form: FormData) =>
    fetcher<Product>(`/api/products/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: form,
    }),
};
