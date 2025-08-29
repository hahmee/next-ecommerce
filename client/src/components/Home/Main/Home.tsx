import dynamic from 'next/dynamic';
import React from 'react';
import LazyLoadWrapper from '@/components/Common/LazyLoadWrapper';

const Categories = dynamic(() => import('./Categories'), { ssr: false });
const ExpertList = dynamic(() => import('../../Admin/Product/ExpertList'), { ssr: false });
const MainProductList = dynamic(() => import('../../Admin/Product/MainProductList'), {
  ssr: false,
});
const MainInfo = dynamic(() => import('../../Admin/Product/MainInfo'), { ssr: false });

const Home = () => {
  return (
    <>
      <div className="mt-24 bg-[#F9F9F9] m-auto py-10">
        <h1 className="text-4xl font-bold text-gray-600 text-center py-10 px-4.5">Categories</h1>
        <LazyLoadWrapper fallback={<div>Loading...</div>}>
          <Categories />
        </LazyLoadWrapper>
      </div>

      <div className="mt-40 px-4">
        <LazyLoadWrapper fallback={<div>Loading...</div>}>
          <ExpertList />
        </LazyLoadWrapper>
      </div>

      <div className="mt-40 px-4">
        <h1 className="text-2xl font-bold text-gray-600 text-center">New Products</h1>
        <div className="w-30 h-1.5 bg-ecomLow text-center rounded m-auto mt-4" />
        <LazyLoadWrapper fallback={<div>Loading...</div>}>
          <MainProductList type="new" />
        </LazyLoadWrapper>
      </div>

      <div className="mt-24 px-4">
        <h1 className="text-2xl font-bold text-gray-600 text-center">Featured Products</h1>
        <div className="w-30 h-1.5 bg-ecomLow text-center rounded m-auto mt-4" />
        <LazyLoadWrapper fallback={<div>Loading...</div>}>
          <MainProductList type="featured" />
        </LazyLoadWrapper>
      </div>
      <MainInfo />
    </>
  );
};
export default Home;
