import React from "react";
import CategoryModal from "@/app/(admin)/@modal/(.)category/add-category/page";
import CategoryPage from "@/app/(admin)/admin/category/page";

export default function AddCategoryPage() {
    return (
        <>
            <CategoryPage/>
            <CategoryModal/>
        </>);

}