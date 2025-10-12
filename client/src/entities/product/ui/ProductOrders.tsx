import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useSafeSearchParams } from '@/features/common/model/useSafeSearchParams';

export type OrderOption = {
  id: string;
  name: string;
};

const orders: OrderOption[] = [
  {
    id: 'newest',
    name: '최신순',
  },
  {
    id: 'sales',
    name: '판매순',
  },
  {
    id: 'low-price',
    name: '낮은가격순',
  },
  {
    id: 'high-price',
    name: '높은가격순',
  },
  {
    id: 'ratings',
    name: '평점높은순',
  },
  {
    id: 'review',
    name: '리뷰많은순',
  },
];

const ProductOrders = () => {
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const searchParams = useSafeSearchParams();
  const router = useRouter();
  const [orderValue, setOrderValue] = useState<OrderOption>();

  useEffect(() => {
    const paramOrder = searchParams.get('order');

    if (paramOrder) {
      const newOrder = orders.find((order) => order.id === paramOrder);
      setOrderValue(newOrder);
    } else {
      setOrderValue(orders[0]);
    }
  }, [searchParams]);

  const onChange = (order: OrderOption) => {
    setOrderValue(order);
    const params = new URLSearchParams(searchParams.toString());

    if (order) {
      params.delete('order');
      params.append('order', order.id);
    }

    // 새 쿼리스트링으로 URL 업데이트
    router.push(`/list?${params.toString()}`);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setSortOpen((open) => !open)}
        className="flex cursor-pointer justify-between w-36 text-sm rounded-3xl ring-1 border-gray-500 text-gray-500 py-2 px-4 text-center"
      >
        <span>{orderValue?.name}</span>
        <ChevronDownIcon className="h-5 w-5" />
      </div>
      {sortOpen && (
        <div className="w-full absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 left-0 z-20 animate-fadeInUp">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center my-2">
              <input
                id={order.id}
                defaultChecked={order === orderValue}
                type="radio"
                value={order.id}
                name="order-radio"
                className="w-5.5 h-5.5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                onChange={() => onChange(order)}
              />
              <label
                htmlFor={order.id}
                className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
              >
                {order.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductOrders;
