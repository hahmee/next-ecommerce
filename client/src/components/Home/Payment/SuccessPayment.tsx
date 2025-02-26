"use client";

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import React, {useCallback, useEffect} from "react";
import Link from "next/link";
import {getCart, getSuccessPayment} from "@/apis/mallAPI";
import {CartItemList} from "@/interface/CartItemList";
import {useCartStore} from "@/store/cartStore";
import {useRouter} from "next/navigation";
import {Member} from "@/interface/Member";
import {setCookie} from "@/utils/cookie";
import {getCookie} from "cookies-next";

interface Props {
    paymentKey: string;
    orderId: string;
    amount: string;
}

const SuccessPayment = ({paymentKey, orderId, amount}: Props) => {

    // 테스트용으로 member값 쿠키에 넣기?

    const {setCarts} = useCartStore();
    const router = useRouter();
    const queryClient = useQueryClient();
    //
    //데이터 가져온 후 다른 페이지로 이동..?
    // const {data: payment, error} = useQuery<DataResponse<any>, any, any, [_1: string, _2: string]>({
    //     queryKey: ['payment', orderId],
    //     queryFn: () => getSuccessPayment({queryKey: ['payment', orderId], paymentKey, orderId, amount}),
    //     staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    //     gcTime: 300 * 1000,
    //     enabled: !!getCookie('member'),
    //     select: useCallback((data: DataResponse<any>) => {
    //         return data.data;
    //     }, []),
    // });
    //
    // const { isFetched, isFetching, data:cartData, isError} = useQuery<DataResponse<Array<CartItemList>>, Object, Array<CartItemList>>({
    //     queryKey: ['carts'],
    //     queryFn: () => getCart(),
    //     staleTime: 60 * 1000,
    //     gcTime: 300 * 1000,
    //     enabled: !!getCookie('member'),
    //     throwOnError: true,
    //
    //     select: (data) => {
    //         // 데이터 가공 로직만 처리
    //         return data.data;
    //     }
    // });

    // console.log('payments..', payment);
    // console.log('cartData..', cartData);

    // 로그인 및 상태 동기화 useEffect
    useEffect(() => {
        console.log("로그인/동기화 useEffect 실행");
        const syncData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        username: "user1@aaa.com",
                        password: "1111",
                    }),
                });

                const data: DataResponse<Member> = await response.json();
                console.log("로그인 응답:", data);
                await setCookie("member", JSON.stringify(data.data));
                // 로그인 성공 후 쿼리 무효화해서 재실행
                // 로그인 성공 후 쿼리 무효화하여 재실행 (await 추가)
                // await queryClient.invalidateQueries({ queryKey: ['payment', orderId] });
                // await queryClient.invalidateQueries({ queryKey: ['carts'] });

            } catch (error) {
                console.error("로그인 에러:", error);
            }

            // if (cartData) {
            //     setCarts(cartData);
            // }
        };

        syncData();
    }, []);

    // if(error) {
    //     console.log('error', error);
    // }

    // success 페이지에서 새로고침시 다른 에러가 발생할 수 있다. 따라서 처리를 해줘야 한다.
    // if(!payment && error) {
    //     router.push(`/order/fail`);
    //     // return null;
    // }

    return <div>success!!</div>

    // return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    //     <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
    //         <h1 className="text-2xl font-bold text-green-600 mb-4">주문이 완료되었습니다!</h1>
    //         <p className="text-gray-700 mb-4">주문이름: {payment.orderName}</p>
    //         <p className="text-gray-700 mb-4">주문번호: <strong>{payment.orderId}</strong></p>
    //         <p className="text-gray-700 mb-4">총 결제 금액: <strong>{payment.totalAmount.toLocaleString()}원</strong></p>
    //         <p className="text-gray-700 mb-6">카드번호: {payment.card.number}</p>
    //
    //         <div className="flex flex-col space-y-4">
    //             <Link href="/">
    //                 <div
    //                     className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none">
    //                     계속 쇼핑하기
    //                 </div>
    //             </Link>
    //             <Link href={`/order/${payment.orderId}`}>
    //                 <div
    //                     className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none">
    //                     주문 내역 확인하기
    //                 </div>
    //             </Link>
    //         </div>
    //     </div>
    // </div>;
    //

};

export default SuccessPayment;