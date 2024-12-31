"use server";
import AdminModal from "@/components/Admin/AdminModal";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/profile/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getCategoryPaths} from "@/apis/adminAPI";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {Mode} from "@/types/mode";

interface Props {
    params: { id: string};
}

export default async function CategoryAddModal({params}: Props) {

    const {id} = params;

    const prefetchOptions = [
        {
            queryKey: ['categoryPaths', id],
            queryFn: () => getCategoryPaths({queryKey: ['categoryPaths', id]})
        },
    ]

    return (
        <AdminModal modalTitle={"상품 카테고리 추가"}>
            <Suspense fallback={<Loading/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <CategoryForm type={Mode.ADD} id={id}/>
                </PrefetchBoundary>
            </Suspense>
        </AdminModal>
    );
};
