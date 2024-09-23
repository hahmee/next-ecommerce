import React from "react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";
import {Mode} from "@/types/mode";

interface Props {
    params: {id: string }
}



export default async function ModifyProductPage({params}: Props) {
    const {id} = params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({queryKey: ['id', id], queryFn: getProduct});
    const dehydratedState = dehydrate(queryClient);


    return (
        <HydrationBoundary state={dehydratedState}>
            <ProductForm type={Mode.EDIT} id={id}/>
         </HydrationBoundary>
    );

}