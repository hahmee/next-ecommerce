import { clientFetcher } from '@/entities/http/clientFetcher';
import { serverFetcher } from '@/entities/http/serverFetcher';

export const fetcher = typeof window === 'undefined' ? serverFetcher : clientFetcher;
