// app/(home)/order/success/page.tsx


import { OrderSuccessPage } from '@/pages/home/order/success';

export interface Props {
  params: { [key: string]: string };
}

export default function Page({ params }: { params: Props }) {
  return <OrderSuccessPage {...params} />;
}
