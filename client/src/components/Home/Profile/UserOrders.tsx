"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {getPayments} from "@/app/(home)/profile/_lib/getPayments";
import {Payment} from "@/interface/Payment";
import {TossPaymentStatus} from "@/types/toss";
import {useRouter} from "next/navigation";

const UserOrders = () => {
    const router = useRouter();

    const {data: orders, isLoading, error} = useQuery<DataResponse<Array<Payment>>, Object, Array<Payment>>({
        queryKey: ['orders'],
        queryFn: () => getPayments({queryKey: ['orders']}),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: false,
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });


    console.log('orders', orders);


    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error..</div>;

    return (
        <section className="w-full lg:w-2/3 bg-white p-6">
            <h1 className="text-2xl mb-4">Orders</h1>
            {orders?.length === 0 ? (
                <p className="text-center">You have no orders yet.</p>
            ) : (
                <table className="min-w-full bg-white">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4">Order ID</th>
                        <th className="py-2 px-4">Total Amount</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders?.map((order) => (
                        <tr key={order.id} className="border-b cursor-pointer hover:bg-gray-50" onClick={()=>router.push(`/order/${order.orderId}`)}>
                            <td className="py-2 px-4">{order.orderId}</td>
                            <td className="py-2 px-4">${order.totalAmount}</td>
                            <td className="py-2 px-4">
                                            <span
                                                className={`px-2 py-1 text-sm rounded ${
                                                    order.status === TossPaymentStatus.DONE
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === TossPaymentStatus.WAITING_FOR_DEPOSIT
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                            </td>
                            <td className="py-2 px-4">
                                {new Date(order.createdAt).toLocaleDateString()}
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
