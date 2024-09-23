'use client';
import AdminModal from "@/components/Admin/AdminModal";
import React, {Suspense} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/app/(admin)/admin/products/loading";
import CategoryAddModalSuspense from "@/components/Admin/Category/CategoryAddModalSuspense";


interface Props {
    params: { id: string};
}

export default function CategoryAddModal({params}: Props) {
    // const {id} = params;

    const router = useRouter();

    const closeModal = () => {
        router.push(`/admin/category`);
    };

    return (
        <AdminModal clickModal={closeModal} modalTitle={"상품 카테고리 추가"}>
            <Suspense fallback={<Loading/>}>
                <CategoryAddModalSuspense params={params}/>
            </Suspense>
        </AdminModal>
    );
}
