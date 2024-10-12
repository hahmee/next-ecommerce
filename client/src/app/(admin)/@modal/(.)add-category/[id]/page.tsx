import AdminModal from "@/components/Admin/AdminModal";
import React, {Suspense} from "react";
import CategoryAddModalSuspense from "@/components/Admin/Category/CategoryAddModalSuspense";
import Loading from "@/app/(admin)/admin/products/loading";


interface Props {
    params: { id?: string};
}

export default function CategoryAddModal({params}: Props) {
    // const {id} = params;
    return (
        <AdminModal modalTitle={"상품 카테고리 추가"}>
            {/*<CategoryForm type={Mode.ADD} id={id}/>*/}
            <Suspense fallback={<Loading/>}>
                <CategoryAddModalSuspense params={params}/>
            </Suspense>
        </AdminModal>
    );
}
