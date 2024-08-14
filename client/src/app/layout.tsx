import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import RQProvider from "@/components/RQProvider";
import AuthSession from "@/components/AuthSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "E-Commerce Application",
    description: "A complete e-commerce application with Next.js",
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
        <AuthSession>
            <RQProvider>
            {children}
            </RQProvider>
        </AuthSession>
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
