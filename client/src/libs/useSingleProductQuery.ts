import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";

export const productSingleQueryOptions = (id:string) => ({
    queryKey: ['productSingle', id],
    queryFn: () => getProduct({ queryKey: ['productSingle', id] }), // queryKey를 전달하여 호출
});


// export function useSingleProductQuery(id:string) {
//     return useQuery({
//         ...allMemosQueryOptions(id),
//         // staleTime: STALE_TIME,
//     });
// }