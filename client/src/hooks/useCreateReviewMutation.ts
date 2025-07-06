
import {useMutation} from "@tanstack/react-query";
import {Review} from "@/interface/Review";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {fetcher} from "@/utils/fetcher/fetcher";
import {SessionExpiredError} from "@/libs/error/errors";

export const useCreateReviewMutation = (orderId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (review: Review) => fetcher("/api/reviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    }),
    onSuccess: () => {
      toast.success("리뷰를 작성했습니다.");
      router.push(`/order/${orderId}`);
    },
    onError: (error: any) => {
      console.error(error);
      // SessionExpiredError는 전역에서 처리하므로 여기선 무시
      if (!(error instanceof SessionExpiredError)) {
        toast.error(`업로드 중 에러가 발생했습니다. ${error?.message}`);
      }
    },
  });
};
