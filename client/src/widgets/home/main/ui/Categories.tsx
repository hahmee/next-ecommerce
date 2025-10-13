'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useCategories } from '@/features/category/read/model/useCategories';
import Skeleton from '@/shared/ui/skeletons/Skeleton';

const Categories = () => {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories) return <Skeleton />;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.cno}
              onClick={() => router.push(`/list?category_id=${category.cno}`)}
              className="relative bg-white rounded-xl shadow-md p-6 cursor-pointer
                    hover:shadow-lg transition-transform transform hover:scale-[1.02] py-8"
            >
              <div className="flex justify-between items-center mb-9">
                <Image
                  src={category.uploadFileName || '/images/mall/no_image.png'}
                  alt="image"
                  width={100}
                  height={100}
                  className="pointer-events-none select-none rounded-full w-20 h-20 object-cover"
                />
                <span className="text-sm text-gray-500">products</span>
              </div>

              <span className="text-sm text-gray-500">Manufacturer</span>
              <h3 className="text-2xl font-semibold text-gray-800 mb-12">{category.cname}</h3>

              <Link href={`/list?category_id=${category.cno}`}>
                <span className="text-sm text-black-600 font-medium hover:text-primary-700">
                  See Collection &rarr;
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
