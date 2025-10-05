// useProductQueries.ts
import {Mode} from "@/types/mode";
import { Product } from '@/interface/Product';
import {useQuery} from "@tanstack/react-query";
import {getCategoryPaths, getProduct} from "@/apis/adminAPI";
import {Category} from "@/interface/Category";
import {clientFetcher} from "@/utils/fetcher/clientFetcher";

export function useProductQueries(type: Mode, id?: string) {
  const enabled = !!id && type === Mode.EDIT;

  const productQ = useQuery<Product>({
    queryKey: ['productSingle', id!],
    queryFn: getProduct,
    enabled,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });

  const categoryPathsQ = useQuery<Category[]>({
    queryKey: ['categoryPaths', productQ.data ? productQ.data.categoryId.toString() : '-1'],
    queryFn: getCategoryPaths,
    enabled,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });

  const categoriesQ = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => clientFetcher('/api/category/list'),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });

  return { productQ, categoryPathsQ, categoriesQ };
}
