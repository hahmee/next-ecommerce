// src/widgets/admin/payment-overview/ui/PaymentOverviewView.tsx

// src/widgets/admin/payment-overview/ui/PaymentOverviewView.tsx

'use client';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React from 'react';

import type { Option } from '@/shared/model/Option';
import ClickOutside from '@/shared/ui/ClickOutside';

export function PaymentOverviewView(props: {
  totalAmount: number;
  count: number;
  isFetching: boolean;
  menu: Array<Option<string> & { startDate: string; endDate: string }>;
  selected: Option<string> & { startDate: string; endDate: string };
  show: boolean;
  setShow: (b: boolean) => void;
  onPick: (opt: Option<string> & { startDate: string; endDate: string }) => void;
}) {
  const { totalAmount, count, isFetching, menu, selected, show, setShow, onPick } = props;

  return (
    <div className="grid grid-cols-2 grid-rows-[auto,1fr] divide-y rounded-sm border shadow-default dark:border-strokedark dark:bg-boxdark bg-white">
      <div className="pl-7.5 py-3 col-span-2 font-semibold text-lg flex items-center relative">
        <div>개요:</div>
        <div
          className="cursor-pointer font-semibold underline px-2 text-center inline-flex items-center"
          onClick={() => setShow(!show)}
        >
          {selected.content}
          <ChevronDownIcon className="ml-2 h-5 w-5" />
        </div>

        {show && (
          <ClickOutside onClick={() => setShow(false)}>
            <div className="z-50 absolute top-12 left-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {menu.map((option) => (
                  <li key={option.id}>
                    <div
                      className={`block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                        option.id === selected.id ? 'bg-primary-500 text-white' : ''
                      }`}
                      onClick={() => onPick(option)}
                    >
                      {option.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ClickOutside>
        )}
      </div>

      <div className="border-r flex flex-col gap-2 p-7.5">
        <div className="font-normal text-sm">총 금액</div>
        <div className="font-semibold text-base">{totalAmount.toLocaleString()} 원</div>
      </div>
      <div className="flex flex-col gap-2 p-7.5">
        <div className="font-normal text-sm">결제 완료</div>
        <div className="font-semibold text-base">{count.toLocaleString()} 건</div>
      </div>
    </div>
  );
}
