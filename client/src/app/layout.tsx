import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import RQProvider from "@/components/RQProvider";
import {Toaster} from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "E-Commerce Application",
    description: "A e-commerce application with Next.js",
    icons: {
        icon: "/images/main/logo.svg", // 절대 경로로 수정
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
        {/* <AuthSession>*/}
        <RQProvider>
            {children}
            <Toaster/>
            <div id="portal-root"></div> {/* 포탈을 위한 DOM 요소 */}
        </RQProvider>
        {/*</AuthSession>*/}
        </body>
        </html>
    );

    // return (
    //     <html lang="en">
    //     <body className={inter.className}>
    //     <AuthSession>
    //         <Navbar/>
    //             {children}
    //         <Footer/>
    //     </AuthSession>
    //     </body>
    //     </html>
    // );
}
