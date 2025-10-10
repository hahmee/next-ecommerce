import React from 'react';
import Footer from '@/components/Home/Footer';
import Navbar from '@/components/Home/Navbar';

export default async function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
