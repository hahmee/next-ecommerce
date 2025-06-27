import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import UserReviews from "@/components/Home/Profile/UserReviews";
import {getUserReviews} from "@/apis/mallAPI";
import Loading from "@/app/loading";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import {cookies} from "next/headers";

export async function generateMetadata() {
    const cookieStore = cookies();
    const memberCookie = cookieStore.get("member");

    let nickname = "사용자";
    let email = "";

    try {
        const parsed = memberCookie?.value
          ? JSON.parse(decodeURIComponent(memberCookie.value))
          : null;
        if (parsed) {
            nickname = parsed.nickname || "사용자";
            email = parsed.email || "";
        }
    } catch (e) {
        // 쿠키 파싱 실패 시 fallback
    }

    return {
        title: `${nickname}님의 리뷰 기록`,
        description: `${nickname} (${email})님의 상품 리뷰 목록입니다.`,
        openGraph: {
            title: `${nickname}님의 리뷰 내역`,
            description: `${email}님의 작성한 모든 상품 리뷰`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/review`,
        },
        twitter: {
            card: "summary",
            title: `${nickname}님의 리뷰 내역`,
            description: `${email}님의 작성 리뷰`,
        },
    };
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

