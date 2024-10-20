"use client";
import CartSummary from "@/components/Home/CartSummary";
import React, {useState} from "react";
import {useCartStore} from "@/store/cartStore";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {OrderStatus} from "@/types/orderStatus";
import {OrderRequest, OrderShippingAddressInfo} from "@/interface/Order";
import {loadTossPayments} from "@tosspayments/payment-sdk";

const Checkout = () => {
    const {cart, subtotal, tax, shippingFee, total} = useCartStore();

    // 배송 정보 상태 관리
    const [shippingInfo, setShippingInfo] = useState<OrderShippingAddressInfo>({
        receiver: '',
        address: '',
        zipCode: '',
        phone: '',
        message: '',
    });

    // 폼 입력 변경 처리
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
    };

    // 결제 요청 처리
    const handlePaymentClick = async (event: React.FormEvent) => {
        event.preventDefault();

        const newOrderId = Math.random().toString(36).slice(2);
        console.log('newOrderId', newOrderId);

        await orderSave(newOrderId);

        const tossPayments = await loadTossPayments(
            process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string
        );

        await tossPayments.requestPayment("카드", {
            amount: total,
            orderId: newOrderId,
            orderName: cart.length > 1 ? `${cart[0].pname} 외 ${cart.length - 1}개` : `${cart[0].pname}`,
            customerName: '판매자_테스트',
            successUrl: process.env.NEXT_PUBLIC_TOSS_SUCCESS as string,
            failUrl: process.env.NEXT_PUBLIC_TOSS_FAIL as string,
        });
    };

    // 주문을 DB에 저장
    const orderSave = async (orderId: string) => {
        const order: OrderRequest = {
            deliveryInfo: shippingInfo,
            carts: cart,
            totalAmount: total,
            shippingFee: shippingFee,
            tax: tax,
            status: OrderStatus.ORDER_CHECKING,
            orderId: orderId,
        };

        await fetchWithAuth(`/api/orders/`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
    };

    return (
        <form onSubmit={handlePaymentClick}>
            <div className="bg-gray-50 min-h-screen">
                <div className="bg-white py-4">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-semibold">Payment</h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3 bg-white p-6 shadow-sm rounded-lg">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">배송 정보</h2>

                            <label className="block mb-2">이름</label>
                            <input
                                className="w-full p-2 border border-gray-300"
                                type="text"
                                name="receiver"
                                value={shippingInfo.receiver}
                                onChange={handleInputChange}
                                required
                            />

                            <label className="block mb-2 mt-4">주소</label>
                            <input
                                className="w-full p-2 border border-gray-300"
                                type="text"
                                name="address"
                                value={shippingInfo.address}
                                onChange={handleInputChange}
                                required
                            />

                            <label className="block mb-2 mt-4">우편번호</label>
                            <input
                                className="w-full p-2 border border-gray-300"
                                type="text"
                                name="zipCode"
                                value={shippingInfo.zipCode}
                                onChange={handleInputChange}
                                required
                            />

                            <label className="block mb-2 mt-4">전화번호</label>
                            <input
                                className="w-full p-2 border border-gray-300"
                                type="tel"
                                name="phone"
                                value={shippingInfo.phone}
                                onChange={handleInputChange}
                                required
                            />

                            <label className="block mb-2 mt-4">배송메시지</label>
                            <input
                                className="w-full p-2 border border-gray-300"
                                type="text"
                                name="message"
                                value={shippingInfo.message}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <CartSummary type={"Payment"} />
                </div>
            </div>
        </form>
    );
};

export default Checkout;
