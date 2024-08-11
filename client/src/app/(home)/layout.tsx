import React from "react";
import AuthSession from "@/components/AuthSession";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DefaultLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Navbar/>
            {children}
            <Footer/>
        </>
    );
}