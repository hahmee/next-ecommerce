// app/(home)/review-write/page.tsx

import { AddReviewPage } from '@/pages/home/review-write';

interface Props {
  oid: string;
  orderId: string;
}

export default function Page({ params }: { params: Props }) {
  return <AddReviewPage oid={params.oid} orderId={params.orderId} />;
}
