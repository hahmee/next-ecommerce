import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {GoogleAnalytics, GoogleTagManager} from "@next/third-parties/google";

const GA_TRACKING_ID = process.env.GOOGLE_GA_TRACKING_ID;


export default function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {

    return (
        <>
            {/*{GA_TRACKING_ID ? (*/}
            {/*    <GoogleAnalytics gaId={GA_TRACKING_ID} />*/}
            {/*) : null}*/}
            {
                GA_TRACKING_ID && <>
                    <GoogleTagManager gtmId={GA_TRACKING_ID} />
                    <GoogleAnalytics gaId={GA_TRACKING_ID} />
                </>
            }

            <Navbar/>
            {children}
            <Footer/>
        </>
    );
}