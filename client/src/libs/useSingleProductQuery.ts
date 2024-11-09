import {getProduct} from "@/api/adminAPI";

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