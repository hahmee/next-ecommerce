import { AddReviewPage } from '@/pages/home/review-write';

interface Props {
  params: { oid: string; orderId: string };
}

export default function Page({ params }: Props) {
  return <AddReviewPage oid={params.oid} orderId={params.orderId} />;
}
