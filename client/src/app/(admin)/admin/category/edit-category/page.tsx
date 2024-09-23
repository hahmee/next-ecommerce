import React from "react";
import CategoryPage from "@/app/(admin)/admin/category/page";
import CategoryEditModal from "@/app/(admin)/@modal/(.)category/edit-category/[id]/page";

export default function AddCategoryPage() {
    return (
        <>
            <CategoryPage/>
            <CategoryEditModal/>
        </>);

}
