// utils/fetcher.ts
import {serverFetcher} from "@/utils/serverFetcher";
import {clientFetcher} from "@/utils/clientFetcher";

export const fetcher =
  typeof window === 'undefined' ? serverFetcher : clientFetcher;