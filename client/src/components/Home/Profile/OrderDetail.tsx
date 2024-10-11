"use client";

import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {getOrder} from "@/app/(home)/order/[orderId]/_lib/getOrder";
import {Order} from "@/interface/Order";
import {OrderStatus} from "@/types/orderStatus";

const getOrderStatusText = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.ORDER_CHECKING:
            return "주문 확인"; // 주문 확인
        case OrderStatus.PAYMENT_CONFIRMED:
            return "결제 완료"; // 지불 완료
        case OrderStatus.PENDING:
            return "대기 중"; // Pending
        case OrderStatus.COMPLETED:
            return "완료됨"; // Completed
        case OrderStatus.CANCELLED:
            return "취소됨"; // Cancelled
        case OrderStatus.SHIPPED:
            return "배송 중"; // Shipped
        case OrderStatus.DELIVERED:
            return "배송 완료"; // Delivered
        case OrderStatus.RETURNED:
            return "반품됨"; // Returned
        case OrderStatus.REFUNDED:
            return "환불됨"; // Refunded
        default:
            return "알 수 없는 상태"; // Unknown status
    }
};

const OrderDetail = ({orderId}:{ orderId: string;}) => {

    const {data: orders, isLoading} = useQuery<DataResponse<Array<Order>>, Object, Array<Order>>({
        queryKey: ['orderSingle', orderId],
        queryFn: () => getOrder({orderId}),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: false,
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });

    if(!orders) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white">
            {/* 주문 정보 */}
            <h1 className="text-2xl font-bold mb-4">주문 상세</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">주문 번호: {orders?.[0].orderId}</h2>
                <p>주문 날짜: {new Date(orders?.[0].createdAt).toLocaleDateString()}</p>
                <p>주문 상태: {getOrderStatusText(orders?.[0].status)}</p>
                <p className="font-bold">총 금액: {orders?.[0].totalAmount.toLocaleString()} 원</p>
            </div>
            {/* 주문 상품 목록 */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">주문 상품</h2>
                <ul className="divide-y divide-gray-200">
                    {orders?.map((item) => (
                        <li key={item.id} className="flex justify-between py-2">
                            <span>{item.productInfo.pname} (x{item.productInfo.qty})</span>
                            <span>{(item.productInfo.price * item.productInfo.qty).toLocaleString()} 원</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 받는 사람 정보 */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">받는사람 정보</h2>
                <ul className="divide-y divide-gray-200">
                    <li className="flex justify-between py-2">
                        <span>받는사람</span>
                        <span>{orders?.[0].deliveryInfo.receiver}</span>
                    </li>
                    <li className="flex justify-between py-2">
                        <span>연락처</span>
                        <span>{orders?.[0].deliveryInfo.phone}</span>
                    </li>
                    <li className="flex justify-between py-2">
                        <span>주소</span>
                        <span>{orders?.[0].deliveryInfo.address}</span>
                    </li>
                    <li className="flex justify-between py-2">
                        <span>배송메시지</span>
                        <span>{orders?.[0].deliveryInfo.message}</span>
                    </li>
                </ul>
            </div>


        </div>

    );
};

export default OrderDetail;