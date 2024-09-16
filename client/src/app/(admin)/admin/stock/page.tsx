import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";
import StockTable from "@/components/Tables/StockTable";

export default function StockPage() {

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Categories"/>
            <div className="flex flex-col gap-10">
                <StockTable/>
            </div>
        </div>
    );

};