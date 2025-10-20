// src/shared/http/fetcher.ts

import { clientFetcher } from '@/shared/http/clientFetcher';
import { serverFetcher } from '@/shared/http/serverFetcher';

export const fetcher = typeof window === 'undefined' ? serverFetcher : clientFetcher;
