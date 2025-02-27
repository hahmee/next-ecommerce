import React from "react";
import Footer from "@/components/Home/Footer";
import {getCookie} from "@/utils/cookie";
import {GoogleAnalytics, GoogleTagManager} from "@next/third-parties/google";
import Navbar from "@/components/Home/Navbar";

const GA_TRACKING_ID = process.env.GOOGLE_GA_TRACKING_ID;
const GTM_TRACKING_ID = process.env.GOOGLE_GTM_TRACKING_ID;

export default async function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {

    // 쿠키에서 'member'라는 이름의 쿠키 값을 가져옴
    const member = await getCookie("member");


    return (
        <>
            {/*{ (GA_TRACKING_ID && GTM_TRACKING_ID) ? (*/}
            {/*    <UserGA/>*/}
            {/*) : null}*/}

            {
                (GA_TRACKING_ID && GTM_TRACKING_ID) && <>
                    <GoogleTagManager gtmId={GTM_TRACKING_ID}/>
                    <GoogleAnalytics gaId={GA_TRACKING_ID}/>
                </>
            }
            <Navbar member={member}/>
            {children}
            <Footer/>
        </>
    );
}