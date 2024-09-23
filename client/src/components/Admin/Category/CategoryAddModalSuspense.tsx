import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {Mode} from "@/types/mode";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {getCategoryPaths} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getCategoryPaths";

interface Props {
    params: {id?: string }
}


export default async function CategoryAddModalSuspense({params}: Props) {
    const {id} = params;

    const queryClient = new QueryClient();

    if(id) { //서브카테고리 추가일때
        await queryClient.prefetchQuery({queryKey: ['categoryPaths', id],  queryFn: getCategoryPaths});
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CategoryForm type={Mode.ADD} id={id}/>
        </HydrationBoundary>
    )
};