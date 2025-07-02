import {cookies} from "next/headers";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import RQProvider from "@/components/Common/RQProvider";
import {Toaster} from "react-hot-toast";
import {GoogleAnalytics} from "@next/third-parties/google";
import {GAPageView} from "@/libs/ga-page-view/GAPageView";
import {UserHydration} from "@/components/UserHydration";
import {fetcher} from "@/utils/fetcher";


const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_TRACKING_ID;

const inter = Inter({ subsets: ["latin"] });


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

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {

  const accessToken = cookies().get("access_token")?.value;

  let user = null

  if (accessToken) {
    try {
      user = await fetcher("/api/profile");
    } catch (e) { // layout.tsx에서 에러나도 error.tsx로 가지 X
      console.error("유저 정보 불러오기 실패:", e);
    }
  }


  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
      <RQProvider>
        <div id="portal-root"></div>
        {
          accessToken && <UserHydration user={user}/>
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
