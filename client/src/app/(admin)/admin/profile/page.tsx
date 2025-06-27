import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Profile from "@/components/Admin/Profile/Profile";
import {getUserInfo} from "@/apis/mallAPI";
import Loading from "@/app/loading";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import {cookies} from "next/headers";

export async function generateMetadata() {
    const cookieStore = cookies();
    const memberCookie = cookieStore.get("member");

    let nickname = "사용자";
    let email = "";

    try {
        const parsed = memberCookie?.value ? JSON.parse(decodeURIComponent(memberCookie.value)) : null;
        if (parsed) {
            nickname = parsed.nickname || "사용자";
            email = parsed.email || "";
        }
    } catch (e) {
        // JSON 파싱 실패 시 fallback
    }

    return {
        title: `${nickname} (${email})`,
        description: `${nickname}님의 프로필 페이지입니다.`,
        openGraph: {
            title: `${nickname}님의 프로필`,
            description: `${email} 프로필 정보`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/profile`,
        },
        twitter: {
            card: "summary",
            title: `${nickname}님의 프로필`,
            description: `${email}의 계정 정보`,
        },
    };
}
export default async function ProfilePage() {

    const prefetchOptions = {
        queryKey: ['user'],
        queryFn: () => getUserInfo(),
    }
    
    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Profile"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ErrorHandlingWrapper>
                            <Profile/>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );

};