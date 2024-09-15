import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";
import CategoryTable from "@/components/Tables/CategoryTable";

export default function CategoryPage() {

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Products"/>
            <div className="flex flex-col gap-10">
             <CategoryTable/>
            </div>
        </div>
    );

};