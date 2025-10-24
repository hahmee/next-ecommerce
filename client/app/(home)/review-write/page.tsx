import { AddReviewPage } from '@/pages/home/review-write';

interface Props {
  oid: string;
  orderId: string;
}

export default function Page({ searchParams }: { searchParams: Props }) {
  const { oid, orderId } = searchParams;

  return <AddReviewPage oid={oid} orderId={orderId} />;
}
