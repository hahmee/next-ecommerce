import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/lib/GoogleAnalytics";

const GA_TRACKING_ID = process.env.GOOGLE_GA_TRACKING_ID;


export default function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {

    return (
        <>
            {GA_TRACKING_ID ? (
                <GoogleAnalytics gaId={GA_TRACKING_ID} />
            ) : null}
            <Navbar/>
            {children}
            <Footer/>
        </>
    );
}