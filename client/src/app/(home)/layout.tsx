import React from "react";
import Footer from "@/components/Home/Footer";
import {cookies} from "next/headers";
import Navbar from "@/components/Home/Navbar";
import {fetcher} from "@/utils/fetcher";


export default async function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {

  const accessToken = cookies().get("access_token")?.value;

  let user = null;

  if(accessToken) {
    user = await fetcher("/api/profile"); //본인 정보 가져오기
  }

  return (
        <>
          <Navbar member={user}/>
            {children}
          <Footer/>
        </>
    );
}