import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getUserServer} from "@/app/(home)/profile/_lib/getUserServer";
import UserInfo from "@/components/UserInfo";
import {getCookie} from "@/utils/cookieUtil";

// export async function generateMetadata() {
//     const session = await auth();
//     const user = session?.user;
//     return {
//         title: `${user?.name} (${user?.email})`,
//         description: `${user?.name} (${user?.email}) 프로필`,
//     }
// }
export default async function ProfilePage()  {

    const {accessToken, email} = getCookie('member');

    //유저 정보를 가져온다.
    // const session = await auth();
    const queryClient = new QueryClient();
    // 데이터를 미리 가져와 캐시에 넣는다.
    await queryClient.prefetchQuery({queryKey: ['users'], queryFn: () => getUserServer()})

    const dehydratedState = dehydrate(queryClient);


    // const accessToken = JSON.parse(memberCookie?.value || "").accessToken;
    // const email = JSON.parse(memberCookie?.value || "").email;

    return (
        <HydrationBoundary state={dehydratedState}>
            <UserInfo/>
        </HydrationBoundary>
    );
}

