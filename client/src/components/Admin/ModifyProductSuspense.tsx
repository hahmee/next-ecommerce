import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";
import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";

export default async function ModifyProductSuspense({id}:{id:string}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({queryKey: ['productSingle', id], queryFn: getProduct});
    await queryClient.prefetchQuery({queryKey: ['categories'], queryFn: () => getCategories()});
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <ProductForm type={Mode.EDIT} id={id}/>
        </HydrationBoundary>

    );

}