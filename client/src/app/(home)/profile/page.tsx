import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getUserServer} from "@/app/(home)/profile/_lib/getUserServer";
import UserInfo from "@/components/UserInfo";
import {getCookie} from "@/utils/getCookieUtil";

export async function generateMetadata() {

    const member = getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 프로필`,
    }
}
export default async function ProfilePage()  {

    const queryClient = new QueryClient();
    // 데이터를 미리 가져와 캐시에 넣는다.
    await queryClient.prefetchQuery({queryKey: ['user'], queryFn: () => getUserServer()})

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <UserInfo/>
        </HydrationBoundary>
    );
}

