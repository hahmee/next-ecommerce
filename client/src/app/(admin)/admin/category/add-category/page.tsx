import React from "react";
import CategoryPage from "@/app/(admin)/admin/category/page";
import CategoryAddModal from "@/app/(admin)/@modal/(.)add-category/[id]/page";
interface Props {
    params: {id?: string }
}
export default function AddCategoryPage({params}: Props) {
    return (
        <>
            <CategoryPage/>
            <CategoryAddModal params={params}/>
        </>);

}
