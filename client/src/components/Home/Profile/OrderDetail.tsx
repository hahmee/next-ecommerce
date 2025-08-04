"use client";

import {useQuery} from "@tanstack/react-query";
import {Order} from "@/interface/Order";
import {OrderStatus} from "@/types/orderStatus";
import Image from "next/image";
import Link from "next/link";
import {getOrders} from "@/apis/mallAPI";
import dayjs from "dayjs";

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

    const {data: orders} = useQuery<Array<Order>, Object, Array<Order>>({
        queryKey: ['orders', orderId],
        queryFn: () => getOrders({orderId}),
        staleTime: 60 * 1000, // 데이터를 최신으로 간주하는 시간 -> 그 시간동안 refetch 안 함
        gcTime: 300 * 1000, // 데이터를 캐싱해서 보관하는 d;g시간, 이후에 삭제 -> unmount 될때부터 측정
        throwOnError: true,
    });

    if(!orders) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                {/* 주문 정보 */}
                <div className="mb-15">
                    <h2 className="text-lg font-semibold mb-2">주문 정보</h2>
                    <ul className="border border-gray-200 rounded p-3 text-xs">
                        <li className="flex justify-between py-1.5">
                            <span className="text-gray-500">주문번호</span>
                            <span>{orders?.[0].orderId}</span>
                        </li>
                        <li className="flex justify-between py-1.5">
                            <span className="tfext-gray-500">주문날짜</span>
                            <span>{orders?.[0]?.createdAt ? dayjs(orders[0].createdAt).format("YYYY.MM.DD") : "-"}</span>
                        </li>
                        <li className="flex justify-between py-1.5">
                        <span className="text-gray-500">주문상태</span>
                            <span> {getOrderStatusText(orders?.[0].status)}</span>
                        </li>
                        <li className="flex justify-between py-1.5">
                            <span className="text-gray-500">총금액</span>
                            <span>{orders?.[0].totalAmount.toLocaleString()} 원</span>
                        </li>
                    </ul>
                </div>

                {/* 주문 상품 목록 */}
                <div className="mb-15">
                    <h2 className="text-lg font-semibold mb-2">주문 상품</h2>
                    <ul className="">
                        {orders?.map((item) => (
                            <li key={item.id}
                                className="flex flex-col p-3 mb-3 border gap-y-3 border-gray-200 rounded ">
                                <span className="text-xs font-black">구매확정</span>
                                <div className="flex gap-3 justify-between">
                                    <div className="flex gap-x-3">
                                        <Link href={`/product/${item.productInfo.pno}`}>
                                            <Image src={item.productInfo.thumbnailUrl || "/images/mall/no_image.png"} alt={'image'} width={500} height={500} className="w-20 h-20 rounded object-cover"/>
                                        </Link>
                                        <div className="flex flex-col text-xs">
                                            <span>{item.productInfo.pname}</span>
                                            <span className="text-gray-500">{(item.productInfo.price).toLocaleString()} 원</span>
                                            <span className="text-gray-500">{item.productInfo.size}</span>
                                            <span className="text-gray-500">{item.productInfo.color.text}</span>
                                            <span className="text-gray-500">{item.productInfo.qty} 개</span>
                                        </div>
                                    </div>

                                    <Link href={`/review-write?oid=${item.id}&orderId=${item.orderId}`}>
                                        <button type="button" className="w-28 text-xs rounded ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none">
                                            리뷰쓰기
                                        </button>
                                    </Link>
                                </div>
                                <div className="bg-gray-50 flex flex-col p-3 rounded text-xs">
                                    <span>배송비 무료(일반택배)</span>
                                    <span>판매자  </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 받는 사람 정보 */}
                <div className="">
                    <h2 className="text-lg font-semibold mb-2">받는사람 정보</h2>
                    <ul className="border border-gray-200 rounded p-3 text-xs">
                        <li className="flex justify-between py-1.5">
                            <span className="text-gray-500">받는사람</span>
                            <span>{orders?.[0].deliveryInfo.receiver}</span>
                        </li>
                        <li className="flex justify-between py-1.5">
                            <span className="text-gray-500">연락처</span>
                            <span>{orders?.[0].deliveryInfo.phone}</span>
                        </li>
                        <li className="flex justify-between py-1.5">
                            <span className="text-gray-500">주소</span>
                            <span>{orders?.[0].deliveryInfo.address}</span>
                        </li>
                        <li className="flex justify-between py-1.5">
                            <span className="text-gray-500">배송메시지</span>
                            <span>{orders?.[0].deliveryInfo.message}</span>
                        </li>
                    </ul>
                </div>


            </div>
        </div>

    );
};

export default OrderDetail;