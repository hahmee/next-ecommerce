import { clientFetcher } from '@/utils/fetcher/clientFetcher';
import { serverFetcher } from '@/utils/fetcher/serverFetcher';

export const fetcher = typeof window === 'undefined' ? serverFetcher : clientFetcher;
