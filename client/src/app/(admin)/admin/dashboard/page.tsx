import Ecommerce from "@/components/Admin/Dashboard/E-commerce";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";

export default function DashBoardPage() {

    return <div className="mx-auto">
        <Breadcrumb pageName="Sales Overview"/>
        <div className="flex flex-col gap-10">

            <Ecommerce/>
        </div>
    </div>;
}