import React from "react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";

export default function AddProductPage() {
    return (
        <ProductForm type={Mode.ADD}/>
    );
}