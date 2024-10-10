"use client";
import { useEffect, useState } from 'react';

interface Order {
    id: string;
    orderId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

const UserOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 수동 데이터 설정
        const manualOrders: Order[] = [
            {
                id: '1',
                orderId: 'ORD12345',
                totalAmount: 120,
                status: 'Completed',
                createdAt: '2024-10-10T10:00:00Z',
            },
            {
                id: '2',
                orderId: 'ORD12346',
                totalAmount: 80,
                status: 'Pending',
                createdAt: '2024-10-08T14:30:00Z',
            },
            {
                id: '3',
                orderId: 'ORD12347',
                totalAmount: 50,
                status: 'Canceled',
                createdAt: '2024-10-06T16:45:00Z',
            },
        ];

        setOrders(manualOrders);
        setLoading(false);
    }, []);

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Order History</h1>
            {orders.length === 0 ? (
                <p className="text-center">You have no orders yet.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4">Order ID</th>
                        <th className="py-2 px-4">Total Amount</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                            <td className="py-2 px-4">{order.orderId}</td>
                            <td className="py-2 px-4">${order.totalAmount}</td>
                            <td className="py-2 px-4">
                  <span
                      className={`px-2 py-1 text-sm rounded ${
                          order.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {order.status}
                  </span>
                            </td>
                            <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserOrders;
