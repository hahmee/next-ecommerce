import React from "react";
import Footer from "@/components/Home/Footer";
import {getCookie} from "@/utils/cookie";
import Navbar from "@/components/Home/Navbar";

export default async function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {

    // 쿠키에서 'member'라는 이름의 쿠키 값을 가져옴
    const member = await getCookie("member");


    return (
        <>
          <Navbar member={member}/>
            {children}
          <Footer/>
        </>
    );
}