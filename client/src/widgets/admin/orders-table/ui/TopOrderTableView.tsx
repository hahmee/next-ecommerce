// src/widgets/admin/orders-table/ui/TopOrderTableView.tsx

// src/widgets/admin/orders-table/ui/TopOrderTableView.tsx

'use client';
import Image from 'next/image';
import React from 'react';

import type { TopProductResponse } from '@/entities/analytics/model/TopProductResponse';

export function TopOrderTableView({ products }: { products: TopProductResponse[] }) {
  return (
    <div className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white sm:px-7.5 xl:pb-1">
        Top Selling items
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-50 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-bold uppercase xsm:text-base">Item name</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-bold uppercase xsm:text-base">Options</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-bold uppercase xsm:text-base">Quantity</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-bold uppercase xsm:text-base">% of total</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block ">
            <h5 className="text-sm font-bold uppercase xsm:text-base">Gross sales</h5>
          </div>
        </div>

        {products.map((product, idx) => (
          <div
            className={`grid grid-cols-4 sm:grid-cols-5 ${idx === products.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
            key={`${product.pname}-${idx}`}
          >
            <div className="flex items-center gap-3 p-2.5">
              <div className="flex-shrink-0">
                <Image
                  src={product.thumbnail || '/images/mall/no_image.png'}
                  alt="image"
                  width={500}
                  height={500}
                  className="object-cover w-15 h-10 flex-none"
                />
              </div>
              <p className="hidden text-black dark:text-white sm:block">{product.pname}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <span className="bg-primary-100 text-primary-800 text-xs px-1.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 mr-2">
                {product.size}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                {product.color.text}
              </span>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{product.quantity.toLocaleString()}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{product.total.toLocaleString()}%</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{product.grossSales.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
