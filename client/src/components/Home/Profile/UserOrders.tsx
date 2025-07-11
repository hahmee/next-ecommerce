"use client";
import {useQuery} from "@tanstack/react-query";
import {Payment} from "@/interface/Payment";
import {TossPaymentStatus} from "@/types/toss";
import {useRouter} from "next/navigation";
import {getPayments} from "@/apis/mallAPI";

const UserOrders = () => {
    const router = useRouter();

    const {data: payments, isLoading, error} = useQuery<Array<Payment>, Object, Array<Payment>>({
        queryKey: ['payments'],
        queryFn: () => getPayments({queryKey: ['payments']}),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true
    });

    if (isLoading) return <div className="text-center py-4">Loading...</div>;

    return (
      <section className="w-full bg-white">
          <p className="text-lg mb-4 font-bold">주문내역</p>
          {payments?.length === 0 ? (
            <p className="text-center">You have no orders yet.</p>
          ) : (
            <table className="min-w-full bg-white border-gray-200 ">
                <thead>
                <tr className="bg-gray-50 text-sm font-black text-left">
                    <th className="py-2 px-4">Order ID</th>
                    <th className="py-2 px-4">Total Amount</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4"></th>
                </tr>
                </thead>
                <tbody>
                {payments?.map((payment) => (
                  <tr key={payment.id} className="cursor-pointer hover:bg-gray-50 border-b"
                      onClick={() => router.push(`/order/${payment.orderId}`)}>
                      <td className="py-2 px-4">{payment.orderId}</td>
                      <td className="py-2 px-4">{(payment.totalAmount).toLocaleString()} 원</td>
                      <td className="py-2 px-4">
                                            <span
                                              className={`px-2 py-1 text-sm rounded ${
                                                payment.status === TossPaymentStatus.DONE
                                                  ? "bg-green-100 text-green-700"
                                                  : payment.status === TossPaymentStatus.WAITING_FOR_DEPOSIT
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                              }`}
                                            >
                                                {payment.status}
                                            </span>
                      </td>
                      <td className="py-2 px-4">
                          {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 flex justify-end">
                          <button type="button"
                                  className="rounded text-xs bg-white ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none">
                              상세보기
                          </button>
                      </td>
                  </tr>
                ))}
                </tbody>
            </table>
          )}
      </section>

    );
};

export default UserOrders;
