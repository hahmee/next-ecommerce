import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {Mode} from "@/types/mode";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {getCategory} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getCategory";
import {getCategoryPaths} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getCategoryPaths";

interface Props {
    params: {id: string }
}


export default async function CategoryEditModalSuspense({params}: Props) {
    const {id} = params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({queryKey: ['category', id],  queryFn: getCategory});
    await queryClient.prefetchQuery({queryKey: ['categoryPaths', id],  queryFn: getCategoryPaths});

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CategoryForm type={Mode.EDIT} id={id}/>
        </HydrationBoundary>
    )
};