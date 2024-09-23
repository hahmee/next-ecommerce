import AdminModal from "@/components/Admin/AdminModal";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import React from "react";
import {useRouter} from "next/navigation";

export default function CategoryEditModal() {
    const router = useRouter();

    const closeModal = () => {
        router.push(`/admin/category`);
    };

    return (
        <AdminModal clickModal={closeModal} modalTitle={"상품 카테고리 수정"}>
            <CategoryForm type={"edit"}/>
        </AdminModal>
    );

}