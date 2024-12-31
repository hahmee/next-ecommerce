import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/profile/loading";
import {getCategory, getCategoryPaths} from "@/apis/adminAPI";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {Mode} from "@/types/mode";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Portal from "@/components/Common/Portal";
import AdminModal from "@/components/Admin/AdminModal";

interface Props {
    params: {id:string};
}

export default async function CategoryEditModal({params}: Props) {

    const {id} = params;
    // const { id } = { id: Number(params.id) };

    const prefetchOptions = [
        {
            queryKey: ['category', id],
            queryFn: () => getCategory({queryKey: ['category', id]}),
        },
        {
            queryKey: ['categoryPaths', id],
            queryFn: () => getCategoryPaths({queryKey: ['categoryPaths', id]})
        }

    ];


    return (
        <AdminModal modalTitle={"상품 카테고리 수정"}>
            <Suspense fallback={<Loading/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <CategoryForm type={Mode.EDIT} id={id}/>
                </PrefetchBoundary>
            </Suspense>
        </AdminModal>
    );

};