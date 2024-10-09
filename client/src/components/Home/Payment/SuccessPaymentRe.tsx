"use client";

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {useCallback} from "react";
import {getSuccessPayment} from "@/app/(home)/order/success/_lib/getSuccessPayment";
import {Category} from "@/interface/Category";

interface Props {
    paymentKey: string | undefined | string[];
    orderId: string | undefined | string[];
    amount: string | undefined | string[];
}

const SuccessPaymentRe = ({paymentKey, orderId, amount}: Props) => {

    // edit일 때만 getProduct하기
    const {data: payments} = useQuery<DataResponse<any>, any, any, [_1: string]>({
        queryKey: ['payment'],
        queryFn: () => getSuccessPayment({queryKey: ['payment'], paymentKey, orderId, amount}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        select: useCallback((data: DataResponse<any>) => {
            return data.data;
        }, []),

    });
    console.log('payments..', payments);

    return <div>SuccessPaymentRe{payments}</div>;
};

export default SuccessPaymentRe;