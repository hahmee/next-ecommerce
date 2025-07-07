import { useMutation } from "@tanstack/react-query";
import {fetcher} from "@/utils/fetcher/fetcher";
import {toast} from "react-hot-toast";
import {SessionExpiredError} from "@/libs/error/errors";

interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export const useConfirmPaymentMutation = () => {
  return useMutation({
    mutationFn: async ({paymentKey, orderId, amount}: ConfirmPaymentParams) =>
      fetcher(`/api/toss/confirm`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({paymentKey, orderId, amount: Number(amount)}),
      }),
    onSuccess: (data) => {
      toast.success("결제가 완료되었습니다.");
    },
    onError: (error: any) => {
      // SessionExpiredError는 전역에서 처리하므로 여기선 무시
      if (!(error instanceof SessionExpiredError)) {
        toast.error(error.message || "결제 완료 처리 실패");
      }
    },
  });
};
