import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import RQProvider from "@/components/Common/RQProvider";
import {Toaster} from "react-hot-toast";
import {GoogleAnalytics} from "@next/third-parties/google";
import {GAPageView} from "@/libs/ga-page-view/GAPageView";
import UserSyncHandler from "@/components/UserSyncHandler";
import SessionExpiredRedirect from "@/components/Error/SessionExpiredRedirect";
import {cookies} from "next/headers";


const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_TRACKING_ID;

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
    title: "E-Commerce Application",
    description: "A e-commerce application with Next.js",
    icons: {
        icon: "/images/main/logo.svg", // 절대 경로로 수정
    },
    other: {
      "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
    },
};


// 서버 컴포넌트는 계층적으로 다시 실행됨
// 모든 상위 컴포넌트가 다시 실행됨
// 해당 layout은 SSR 요청마다 항상 실행됨
export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  // refresh_token이 없는 비로그인자는 /api/me 요청 자체를 아예 하지 않음
  // 반면, refresh_token이 있는데 /api/me 요청이 실패한다면 → 세션 만료로 판단하고 로그아웃 처리
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  return (
    <html lang="en">
    <body className={inter.className} suppressHydrationWarning={true}>
    <RQProvider>
      <div id="portal-root"></div>
      <SessionExpiredRedirect/>
      {
        refreshToken && <UserSyncHandler/>
      }
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
    </body>
    </html>
  );
};
