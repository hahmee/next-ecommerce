import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { fetcher } from '@/entities/http/fetcher';
import { Review } from '@/entities/review/model/types';

export const useCreateReviewMutation = (orderId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (review: Review) =>
      fetcher('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      }),
    onSuccess: () => {
      toast.success('리뷰를 작성했습니다.');
      router.push(`/order/${orderId}`);
    },
  });
};
