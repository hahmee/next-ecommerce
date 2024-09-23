import AdminModal from "@/components/Admin/AdminModal";
import React from "react";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {Mode} from "@/types/mode";


interface Props {
    params: { id?: string};
}

export default function CategoryAddModal({params}: Props) {
    const {id} = params;
    return (
        <AdminModal modalTitle={"상품 카테고리 추가"}>
            <CategoryForm type={Mode.ADD} id={id}/>
            {/*<Suspense fallback={<Loading/>}>*/}
            {/*    <CategoryAddModalSuspense params={params}/>*/}
            {/*</Suspense>*/}
        </AdminModal>
    );
}
