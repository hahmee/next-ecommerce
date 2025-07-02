import React from "react";
import Footer from "@/components/Home/Footer";
import Navbar from "@/components/Home/Navbar";


export default async function DefaultLayout({children}: Readonly<{ children: React.ReactNode }>) {

  return (
    <>
      {/*<ErrorHandlingWrapper>*/}
      {/*  <Suspense fallback={<div>로딩 중입니다...</div>}>*/}
      <Navbar/>
      {/*</Suspense>*/}
      {/*</ErrorHandlingWrapper>*/}
      {children}
      <Footer/>
    </>
  );
}