import {cookies} from "next/headers";

export const dynamic = 'force-dynamic'; // SSR로 강제 전환 (request-aware)

import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import RQProvider from "@/components/Common/RQProvider";
import {Toaster} from "react-hot-toast";
import {GoogleAnalytics} from "@next/third-parties/google";
import {GAPageView} from "@/libs/ga-page-view/GAPageView";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_TRACKING_ID;

const inter = Inter({ subsets: ["latin"] });

// ✅ 함수 바깥에서 요청 쿠키 읽기
const access = cookies().get("access_token");

console.log("SSR access_token from layout.tsx:", access);

export const metadata: Metadata = {
    title: "E-Commerce Application",
    description: "A e-commerce application with Next.js",
    icons: {
        icon: "/images/main/logo.svg", // 절대 경로로 수정
    },
    other: {
        "google-site-verification": "Al9v_xjka2c-c1TtoimoHoEXJYG2A565b2iwaXqzhAw",
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {

    return (
        <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
        <RQProvider>
            <div id="portal-root"></div>
            {/* 포탈을 위한 DOM 요소 */}
            {children}
            <Toaster/>
        </RQProvider>
        {
          (GA_TRACKING_ID) && <>
              {/*두 개 동시에 쓰지 말것 */}
              {/*<GoogleTagManager gtmId={GTM_TRACKING_ID}/>*/}
              <GoogleAnalytics gaId={GA_TRACKING_ID}/>
          </>
        }
        <GAPageView/>
        <div>{access ? `SSR에서 토큰 있음` : `SSR에서 토큰 없음`}</div>

        </body>
        </html>
    );
}
