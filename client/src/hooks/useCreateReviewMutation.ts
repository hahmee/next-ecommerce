import {useMutation} from '@tanstack/react-query';
import {Review} from '@/interface/Review';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {fetcher} from '@/utils/fetcher/fetcher';

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
