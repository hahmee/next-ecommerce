import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import UserReviews from "@/components/Home/Profile/UserReviews";
import {getUserReviews} from "@/apis/mallAPI";
import {getCookie} from "@/utils/cookie";
import Loading from "@/app/loading";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

export async function generateMetadata() {

    const member = await getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 리뷰`,
    }
}
export default async function ReviewHistoryPage()  {

    const prefetchOptions = [
        {
            queryKey: ['myReviews'],
            queryFn: () => getUserReviews({queryKey: ['myReviews']}),
        }
    ]

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ErrorHandlingWrapper>
                    <div className="container mx-auto px-4 py-8 ">
                        <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                            <UserReviews/>
                        </div>
                    </div>
                </ErrorHandlingWrapper>
            </PrefetchBoundary>
        </Suspense>
    );
}

