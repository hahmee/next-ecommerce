import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";

export default async function AdminOrderPage({params, searchParams}: {
    params: { slug: string },
    searchParams: { [key: string]: string | string[] | undefined; }
}) {
    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Orders"/>
            <div className="flex flex-col gap-10">

            </div>
        </div>
    );
};