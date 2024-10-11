"use client";
import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import {getCategoryPaths} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getCategoryPaths";
import {getPayments} from "@/app/(home)/profile/_lib/getPayments";
import {Payment} from "@/interface/Payment";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
import {TossPaymentStatus} from "@/types/toss";

interface Order {
    id: string;
    orderId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

const UserOrders = () => {
    // const [orders, setOrders] = useState<Order[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);

    const {data: orders, isLoading} = useQuery<DataResponse<Array<Payment>>, Object, Array<Payment>>({
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
    // const {isLoading, data: orders, error: pathError} = useQuery<DataResponse<Payment[]>, Object, DataResponse<Payment[]>>({
    //     queryKey: ['orders'],
    //     queryFn: () => getPayments(),
    //     staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    //     gcTime: 300 * 1000,
    //     select: useCallback((data) => {
    //         return data.data;
    //     }, []),
    //
    // });

    //
    // useEffect(() => {
    //     const manualOrders: Order[] = [
    //         {
    //             id: "1",
    //             orderId: "ORD12345",
    //             totalAmount: 120,
    //             status: "Completed",
    //             createdAt: "2024-10-10T10:00:00Z",
    //         },
    //         {
    //             id: "2",
    //             orderId: "ORD12346",
    //             totalAmount: 80,
    //             status: "Pending",
    //             createdAt: "2024-10-08T14:30:00Z",
    //         },
    //         {
    //             id: "3",
    //             orderId: "ORD12347",
    //             totalAmount: 50,
    //             status: "Canceled",
    //             createdAt: "2024-10-06T16:45:00Z",
    //         },
    //     ];
    //
    //     setOrders(manualOrders);
    //     setLoading(false);
    // }, []);
    //
    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    // if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
    //


    return (
        <div className="container mx-auto px-4 py-8 ">
            <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                {/* 프로필 섹션 */}
                <aside className="w-full lg:w-1/3 bg-white p-6 ">
                    <h2 className="text-2xl mb-4">Profile</h2>
                    <div className="flex items-center mb-4">
                        <Image
                            src="https://via.placeholder.com/100"
                            alt="User Profile"
                            className="rounded-full w-24 h-24"
                            width={500}
                            height={500}
                        />
                        <div className="ml-4">
                            <p className="text-xl font-bold">John Doe</p>
                            <p className="text-gray-500">johndoe@example.com</p>
                        </div>
                    </div>

                    <button
                        className="bg-ecom w-full text-white p-2 rounded-md cursor-pointer disabled:bg-pink-200 disabled:cursor-not-allowed">
                        Edit Profile
                    </button>

                </aside>

                {/* 주문 내역 섹션 */}
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
                                <tr key={order.id} className="border-b">
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
            </div>
        </div>
    );
};

export default UserOrders;
