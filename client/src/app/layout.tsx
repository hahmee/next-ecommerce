import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import RQProvider from "@/components/Common/RQProvider";
import {Toaster} from "react-hot-toast";

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
        </body>
        </html>
    );
}
