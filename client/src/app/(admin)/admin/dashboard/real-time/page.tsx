"use server";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {ChartFilter} from "@/types/chartFilter";
import formatDate from "@/libs/formatDate";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import {getGARecentUsersTop} from "@/apis/dashbaordAPI";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

//서버 컴포넌트는 인증된 사용자 정보를 신뢰할 수 없음 (CSR처럼 동기화 불가능)
// SSR에서는 access_token이 만료되었을 수도 있고,
// 쿠키가 새로 갱신되었더라도 반영되지 않음
// 따라서 SSR에서 유저 정보를 fetch해서 쓴다? → 언제든 null, expired일 수 있음

export default async function DashBoardRealTimePage() {
    // const cookieStore = cookies();
    //서버 컴포넌트는 브라우저 쿠키가 갱신되었더라도 그것을 실시간으로 반영하지 못함. (여전히 만료된 값 읽음)
    // const accessToken = cookieStore.get("access_token")?.value;

    // console.log('DashBoardRealTimePage- accessToken: ',accessToken)
    // 여기서 user정보를  가져오는 getuserinfo 로 해도 accessToken이 undefined 이기때문에 무용지물

    //따라서 클라이언트에서 사용자 정보 전달 (CSR 기반 전환)
    const endDate = new Date(); // today
    const startDate = new Date(); // today

    startDate.setDate(endDate.getDate() - 30); // 30 days ago

    // 새로운 날짜 계산
    const comparedEndDate = new Date(startDate); // endDate 복사
    comparedEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

    const comparedStartDate = new Date(comparedEndDate); // newEndDate 복사
    comparedStartDate.setDate(comparedEndDate.getDate() - 30); // 차이만큼 날짜 빼기

    const date = {
        startDate: formatDate(startDate), // format as YYYY-MM-DD
        endDate: formatDate(endDate), // format as YYYY-MM-DD
    };

    const prefetchOptions = [
        {
            queryKey: ['gaRecentUsersTop', date, ChartFilter.DAY],
            queryFn: () => getGARecentUsersTop(
                {
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    // sellerEmail: user?.email || "", // 여기는 그럼 어쩌지? -> 백엔드에서 가져오는걸로 하셈
                    filter: ChartFilter.DAY,
                    comparedStartDate: formatDate(comparedStartDate),
                    comparedEndDate: formatDate(comparedEndDate),
                }
            ),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Real-time Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<DashboardSkeleton/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <ErrorHandlingWrapper>
                        <div>asdf</div>
                        {/*<RealtimeOverview/>*/}
                    </ErrorHandlingWrapper>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>;
}