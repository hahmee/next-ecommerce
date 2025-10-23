// app/(home)/review-write/page.tsx

import { ReviewWritePage } from '@/pages/home/review-write';

type SearchParams = {
  oid: string;
  orderId: string;
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return <ReviewWritePage searchParams={searchParams} />;
}