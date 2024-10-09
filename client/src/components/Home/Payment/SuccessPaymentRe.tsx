"use client";

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Product} from "@/interface/Product";
import {useCallback} from "react";
import {getSuccessPayment} from "@/app/(home)/order/success/_lib/getSuccessPayment";

const SuccessPaymentRe = ({ paymentKey, orderId, amount}:{ paymentKey, orderId, amount}) => {
    const queryClient = useQueryClient();

    // edit일 때만 getProduct하기
    const {data: payment} = useQuery<DataResponse<any>, Object, any, [_1: string]>({
        queryKey: ['payment'],
        queryFn: getSuccessPayment(['payment'], ),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        select: useCallback((data: DataResponse<any>) => {
            return data.data;
        }, []),

    });

    return <div>SuccessPaymentRe</div>
};

export default SuccessPaymentRe;