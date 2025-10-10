import { serverFetcher } from '@/utils/fetcher/serverFetcher';
import { clientFetcher } from '@/utils/fetcher/clientFetcher';

export const fetcher = typeof window === 'undefined' ? serverFetcher : clientFetcher;
