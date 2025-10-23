// app/(home)/order/confirmation/[paymentKey]/page.tsx


import { ConfirmPage } from '@/pages/home/order/confirmation';

interface Props {
  params: { paymentKey: string };
}

export default function Page({ params }: Props) {
  return <ConfirmPage paymentKey={params.paymentKey} />;
}
