"use client";

import {sendGAEvent} from "@next/third-parties/google";
import {usePathname} from "next/navigation";
import {useEffect} from "react";

export default function useGAPageView(sellerId: string) {
    const pathname = usePathname();  // 현재 페이지 경로를 가져온다.
    useEffect(() => {
        sendGAEvent("page_view", { page_path: pathname, seller_id: sellerId || null });  // 페이지 경로가 변경될 때마다 페이지뷰 이벤트를 전송한다.
    }, [pathname]);  // pathname이 변경될 때마다 useEffect 훅이 실행된다.

    return null;
}

// 페이지뷰 이벤트를 GA4에 전송하여 사용자의 페이지 방문 데이터를 추적한다.
export function GAPageView({sellerId}:{ sellerId: string }) {
    useGAPageView(sellerId);  // useGAPageView 훅을 호출하여 페이지뷰 이벤트를 전송한다.
    return null;
}