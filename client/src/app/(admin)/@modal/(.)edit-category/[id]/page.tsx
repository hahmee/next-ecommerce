// 'use client';
import AdminModal from "@/components/Admin/AdminModal";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import CategoryEditModalSuspense from "@/components/Admin/Category/CategoryEditModalSuspense";

interface Props {
    params: {id:string};
}

export default function CategoryEditModal({params}: Props) {

    return (
        <AdminModal modalTitle={"상품 카테고리 수정"} >
            <Suspense fallback={<Loading/>}>
                <CategoryEditModalSuspense params={params}/>
            </Suspense>
            {/*<CategoryForm type={Mode.EDIT} id={id}/>*/}
        </AdminModal>
    );

};