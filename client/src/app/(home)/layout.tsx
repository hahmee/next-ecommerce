import React from 'react';

import Footer from '@/components/Home/Common/Footer';
import Navbar from '@/components/Home/Common/Navbar';

export default async function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
