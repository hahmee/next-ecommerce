import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getPaymentsByEmail} from "@/app/(admin)/admin/order/_lib/getPaymentsByEmail";
import PaymentOverview from "@/components/Admin/Payment/PaymentOverview";
import PaymentTable from "@/components/Tables/PaymentTable";

export default async function AdminPaymentPage() {

    const prefetchOptions = [

        {
            queryKey: ['adminPayments', {page: 1, size: 10, search: ""}],
            queryFn: () => getPaymentsByEmail({page: 1, size: 10, search: ""}),
        }
    ];

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Payments"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                            <div className="col-span-12">
                                <PaymentOverview/>
                                <PaymentTable/>
                            </div>
                        </div>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
);
};
