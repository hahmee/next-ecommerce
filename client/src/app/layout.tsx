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
            <div id="portal-root"></div> {/* 포탈을 위한 DOM 요소 */}
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
        <GAPageView />
        </body>
        </html>
    );
}
