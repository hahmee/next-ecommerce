import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";
import StockTable from "@/components/Tables/StockTable";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";

export default function StockPage() {

    const prefetchOptions =
        {
            queryKey: ['adminStockProducts', {page:1, size:10, search:""}],
            queryFn: () => getProductsByEmail({page: 1, size: 10, search:""}),
        }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Stock"/>
            <div className="flex flex-col gap-10">
                <StockTable/>
            </div>
        </div>
    );

};