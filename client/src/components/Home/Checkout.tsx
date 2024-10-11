"use client";
import CartSummary from "@/components/Home/CartSummary";
import React, {FormEvent, FormEventHandler, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useCartStore} from "@/store/cartStore";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {OrderStatus} from "@/types/orderStatus";
import {Order, OrderShippingAddressInfo} from "@/interface/Order";
import {loadTossPayments} from "@tosspayments/payment-sdk";
import {CartItemList} from "@/interface/CartItemList";

export interface ErrorPaymentResponse {
    response: {
        data: {
            message: string;
            code: string;
        };
    };
}

export interface PaymentTest {
    orderName: string;
    approvedAt: string;
    receipt: {
        url: string;
    };
    totalAmount: number;
    method: '카드' | '가상계좌' | '계좌이체';
    paymentKey: string;
    orderId: string;
    card: {amount:number, number: number;}
    status:
        | 'READY'
        | 'IN_PROGRESS'
        | 'WAITING_FOR_DEPOSIT'
        | 'DONE'
        | 'CANCELED'
        | 'PARTIAL_CANCELED'
        | 'ABORTED'
        | 'EXPIRED';
}

const Checkout = () => {

    const {cart, isLoading, open,subtotal ,changeOpen} = useCartStore();
    // const [orderId, setOrderId] = useState<string | null>(null);


    // 배송 정보 및 결제 정보 상태 관리
    const [shippingInfo, setShippingInfo] = useState<OrderShippingAddressInfo>({
        receiver: '',
        address: '',
        zipCode:'',
        phone: '',
        message:'',
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    const handlePaymentClick: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {

        event.preventDefault();
        //
        // orderId를 생성하고 상태로 저장
        const newOrderId = Math.random().toString(36).slice(2);

        // 주문 저장
        await orderSave(newOrderId);

        //토스 결제창
        const tossPayments = await loadTossPayments(
            process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string
        );

        await tossPayments.requestPayment("카드", {
            amount: subtotal,
            orderId: newOrderId,
            orderName: cart.length > 1 ? `${cart[0].pname} 외 ${cart.length - 1}개` : `${cart[0].pname}`,
            customerName: '판매자_테스트', //판매자, 판매처 이름
            successUrl: process.env.NEXT_PUBLIC_TOSS_SUCCESS as string,
            failUrl: process.env.NEXT_PUBLIC_TOSS_FAIL as string,
        });
    };


    //주문을 db에 저장한다.
    const orderSave = async (orderId: string) => {

        const order: Order = {
            deliveryInfo: {
                ...shippingInfo,
            },
            carts: cart,
            // productInfo: {
            //
            // },
            totalAmount: subtotal, status: OrderStatus.ORDER_CHECKING, orderId: orderId !== null ? orderId : '',
        };

        console.log('order', order);

        //order에 있는 거 다

        await fetchWithAuth(`/api/orders/`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order),

            }); // json 형태로 이미 반환
    };


    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();

        },


        async onSuccess(response, variable) {

            toast.success('업로드 성공했습니다.');
            //최신 카테고리 목록
            // await queryClient.invalidateQueries({queryKey: ['categories']});

        },

        onError(error) {
            console.log('error/....', error.message);
            toast.error(error.message);

        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value  } = e.target;
        if (name in shippingInfo) {
            setShippingInfo({ ...shippingInfo, [name]: value });
        }
        else if (name in paymentInfo) {
            setPaymentInfo({ ...paymentInfo, [name]: value });
        }
    };


    return (
        <form>
            <div className="bg-gray-50 min-h-screen">
                {/* Cart Header */}
                <div className="bg-white py-4">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-semibold">Payment</h1>
                    </div>
                </div>

                {/* Cart Items Section */}
                <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3 bg-white p-6 shadow-sm rounded-lg">

                        {/* 배송 정보 입력 섹션 */}
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
                        {/* 결제 정보 입력 섹션 */}
                        {/*<div className="mb-8">*/}
                        {/*    <h2 className="text-2xl font-semibold mb-4">결제 정보</h2>*/}

                        {/*    <label className="block mb-2">카드 번호</label>*/}
                        {/*    <input*/}
                        {/*        className="w-full p-2 border border-gray-300"*/}
                        {/*        type="text"*/}
                        {/*        name="cardNumber"*/}
                        {/*        value={paymentInfo.cardNumber}*/}
                        {/*        onChange={handleInputChange}*/}
                        {/*        required*/}
                        {/*    />*/}

                        {/*    <label className="block mb-2 mt-4">유효 기간 (MM/YY)</label>*/}
                        {/*    <input*/}
                        {/*        className="w-full p-2 border border-gray-300"*/}
                        {/*        type="text"*/}
                        {/*        name="expiryDate"*/}
                        {/*        value={paymentInfo.expiryDate}*/}
                        {/*        onChange={handleInputChange}*/}
                        {/*        required*/}
                        {/*    />*/}

                        {/*    <label className="block mb-2 mt-4">CVC</label>*/}
                        {/*    <input*/}
                        {/*        className="w-full p-2 border border-gray-300"*/}
                        {/*        type="text"*/}
                        {/*        name="cvc"*/}
                        {/*        value={paymentInfo.cvc}*/}
                        {/*        onChange={handleInputChange}*/}
                        {/*        required*/}
                        {/*    />*/}
                        {/*</div>*/}


                    </div>
                    {/* Cart Summary */}
                    <CartSummary type={"Payment"} cartButtonClick={(e)=>handlePaymentClick(e)}/>
                </div>
            </div>
        </form>
    );
}
export default Checkout;