import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import PaymentOverview from "@/components/Admin/Payment/PaymentOverview";
import PaymentTable from "@/components/Admin/Tables/PaymentTable";
import {getPaymentsByEmail, getPaymentsOverview} from "@/apis/adminAPI";
import PaymentSkeleton from "@/components/Skeleton/PaymentSkeleton";
import formatDate from "@/libs/formatDate";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

export default async function AdminPaymentPage() {
    const endDate = new Date(); // today
    const startDate = new Date(); // today
    startDate.setDate(startDate.getDate() - 30); // 오늘 기준으로 30일 전

    //테이블 기간
    const date = {
        startDate: formatDate(startDate), // format as YYYY-MM-DD
        endDate: formatDate(endDate), // format as YYYY-MM-DD
    };

    //오버뷰 기간
    const overViewDate = {
        startDate: formatDate(startDate), // format as YYYY-MM-DD
        endDate: formatDate(endDate), // format as YYYY-MM-DD
    }

    const prefetchOptions = [
        {
            queryKey: ['adminPaymentOverview', {date: overViewDate}],
            queryFn: () => getPaymentsOverview({
                startDate: formatDate(startDate), // format as YYYY-MM-DD
                endDate: formatDate(endDate), // format as YYYY-MM-DD
            }),
        },
        {
            queryKey: ['adminPayments', {page: 1, size: 10, search: "", date}],
            queryFn: () => getPaymentsByEmail({
                page: 1, size: 10, search: "",
                startDate: formatDate(startDate), // format as YYYY-MM-DD
                endDate: formatDate(endDate), // format as YYYY-MM-DD
            }),
        }
    ];

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Payments"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<PaymentSkeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ErrorHandlingWrapper>
                            <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                                <div className="col-span-12">
                                    <PaymentOverview/>
                                    <PaymentTable/>
                                </div>
                            </div>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );
};
