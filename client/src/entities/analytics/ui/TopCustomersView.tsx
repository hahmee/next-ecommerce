'use client';
import Image from 'next/image';
import React from 'react';

import type { TopCustomerResponse } from '@/entities/analytics';

export function TopCustomersView({ customers }: { customers: TopCustomerResponse[] }) {
  return (
    <>
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white ">
        Top paying customers
      </h4>

      <div className="border-t border-stroke">
        {customers.map((customer) => (
          <div
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={customer.email}
          >
            <div className="relative h-14 w-14 rounded-full">
              <Image
                width={56}
                height={56}
                src="/images/mall/no_image.png"
                alt="User"
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white z-10" />
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">{customer.email}</h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {customer.payment.toLocaleString()} 원
                  </span>
                </p>
                <p>
                  <span className="text-xs text-black dark:text-white">
                    Orders: {customer.orderCount} 건
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
