import React from "react";
import AuthSession from "@/components/AuthSession";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {Toaster} from "react-hot-toast";

export default function DefaultLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Navbar/>
            {children}
            <Footer/>
        </>
    );
}