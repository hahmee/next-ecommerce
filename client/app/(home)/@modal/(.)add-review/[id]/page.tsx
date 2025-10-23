// app/(home)/@modal/(.)add-review/[id]/page.tsx

import { AddReviewPage } from '@/pages/home/review-write/ui/review-write-page';


interface Props {
  params: { oid: string; orderId: string };
}

export default function Page({ params }: Props) {
  return <AddReviewPage oid={params.oid} orderId={params.orderId} />;
}
