import {fetchWithAuth} from "@/utils/fetchWithAuth";

export const getUserReviews = async ({queryKey}: { queryKey: [string] }) => {
    console.log('queryKey....', queryKey);

    const res = await fetchWithAuth(`/api/reviews/myReviews`, {
        // next: {
        //     tags: ['cno', cno],
        // },
        method: "GET",
        credentials: 'include',
        // cache: 'no-store',
    });

    // console.log('res...', res);
    return res;

}