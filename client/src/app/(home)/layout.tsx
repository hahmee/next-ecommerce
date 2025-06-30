import React from "react";
import Footer from "@/components/Home/Footer";
import {cookies} from "next/headers";
import Navbar from "@/components/Home/Navbar";


export default async function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {

  const memberCookie = cookies().get("member")?.value;
  console.log("memberCookie", memberCookie);

  let member = null;
  if (memberCookie) {
    try {
      member = JSON.parse(decodeURIComponent(memberCookie));
    } catch (e) {
      console.error("member 쿠키 파싱 실패", e);
    }
  }


  return (
        <>
          <Navbar member={member}/>
            {children}
          <Footer/>
        </>
    );
}