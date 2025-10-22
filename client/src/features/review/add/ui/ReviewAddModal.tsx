// src/features/review/add/ui/ReviewAddModal.tsx



'use client';
import { ReviewAddModalView } from '@/features/review/add/ui/ReviewAddModalView';
import { useReviewAdd } from '@/features/review/read/model/useReviewAdd';

export default function ReviewAddModal({ id, orderId }: { id: string; orderId: string }) {
  const { order, isOrderLoading, isSubmitting, submit, close } = useReviewAdd(id, orderId);
  if (isOrderLoading || !order) return null;

  return (
    <ReviewAddModalView
      order={order}
      orderId={orderId}
      isSubmitting={isSubmitting}
      onClose={close}
      onSubmit={({ rating, content }) => submit(rating, content)}
    />
  );
}
