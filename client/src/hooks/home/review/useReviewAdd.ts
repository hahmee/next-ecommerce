'use client';
import { useRouter } from 'next/navigation';

import { useCreateReviewMutation } from '@/hooks/home/review/useCreateReviewMutation';
import { useReviewOrder } from '@/hooks/home/review/useReviewOrder';
import type { Review } from '@/interface/Review';

export function useReviewAdd(oid: string, orderId: string) {
  const router = useRouter();
  const { order, isLoading, error } = useReviewOrder(oid);
  const { mutate, isPending } = useCreateReviewMutation(orderId);

  const close = () => router.push(`/order/${orderId}`);

  const submit = (rating: number, content: string) => {
    if (!order) return;
    const payload: Review = {
      content,
      rating, // 1~5
      orderId,
      pno: order.productInfo.pno,
      oid: Number(oid),
      owner: null,
      order: null,
      createdAt: null,
      updatedAt: null,
    };
    mutate(payload, { onSuccess: close });
  };

  return {
    order,
    isOrderLoading: isLoading,
    orderError: error,
    isSubmitting: isPending,
    submit,
    close,
  } as const;
}
