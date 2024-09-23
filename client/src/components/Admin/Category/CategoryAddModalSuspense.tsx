import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {Mode} from "@/types/mode";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {getCategory} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getProduct";

interface Props {
    params: {id?: string }
}


export default async function CategoryAddModalSuspense({params}: Props) {
    // const {id} = params;

    const id = params.id ||  ;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({queryKey: ['category', id],  queryFn: getCategory});
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CategoryForm type={Mode.ADD} id={id}/>
        </HydrationBoundary>
    )
};