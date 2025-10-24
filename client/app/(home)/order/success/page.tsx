import { OrderSuccessPage } from '@/pages/home/order/success';

export interface Props {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export default function Page({ searchParams }: { searchParams: Props }) {
  return <OrderSuccessPage {...searchParams} />;
}
