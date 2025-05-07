"use server";
import AdminModal from "@/components/Admin/AdminModal";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getCategoryPaths} from "@/apis/adminAPI";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {Mode} from "@/types/mode";
import Loading from "@/app/loading";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

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
                    <ErrorHandlingWrapper>
                        <CategoryForm type={Mode.ADD} id={id}/>
                    </ErrorHandlingWrapper>
                </PrefetchBoundary>
            </Suspense>
        </AdminModal>
    );
};
