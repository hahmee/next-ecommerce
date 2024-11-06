import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserGA from "@/libs/UserGA";
import {GoogleAnalytics, GoogleTagManager} from "@next/third-parties/google";

const GA_TRACKING_ID = process.env.GOOGLE_GA_TRACKING_ID;
const GTM_TRACKING_ID = process.env.GOOGLE_GTM_TRACKING_ID;

export default function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {


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
            <Navbar/>
            {children}
            <Footer/>
        </>
    );
}