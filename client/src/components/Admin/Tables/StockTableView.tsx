'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { salesOptions } from '@/components/Admin/Product/presets';
import Select from '@/components/Admin/Product/Select';
import PageComponent from '@/components/Admin/Tables/PageComponent';
import TableActions from '@/components/Admin/Tables/TableActions';
import TableSearch from '@/components/Admin/Tables/TableSearch';
import ViewButton from '@/components/Admin/Tables/ViewButton';
import type { Paging } from '@/interface/Paging';
import type { Product } from '@/interface/Product';

export function StockTableView(props: {
  list: Product[];
  paging: Paging;
  page: number;
  size: number;
  search: string;
  isFetching: boolean;
  handleSearch: (v: string) => void;
  changeSize: (n: number) => void;
  changePage: (n: number) => void;
  changeStock: (pno: number, salesStatus: string) => void;
}) {
  const { list, paging, search, changeSize, changePage, handleSearch, changeStock } = props;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/2">
          <TableSearch onSearch={handleSearch} placeholder="Search product name" />
        </div>
        <div className="w-full md:w-auto flex md:items-center justify-end">
          <ViewButton changeSize={changeSize} />
        </div>
      </div>

      <div className="w-auto overflow-x-auto overflow-y-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">상품이름</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">재고</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((product) => (
                <tr
                  key={product.pno}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link
                      href={`/admin/products/${product.pno}`}
                      className="flex items-center gap-2"
                    >
                      {product.uploadFileNames?.[0]?.file && (
                        <Image
                          src={product.uploadFileNames[0].file}
                          width={48}
                          height={48}
                          className="object-cover rounded-full w-12 h-12 flex-none"
                          alt="Product"
                        />
                      )}
                      <p className="truncate w-full">{product.pname}</p>
                    </Link>
                  </th>
                  <td className="px-4 py-3 whitespace-nowrap">{product.sku}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Select
                      options={salesOptions}
                      originalData={product.salesStatus}
                      name="stock"
                      doAction={(value) => changeStock(product.pno, value)}
                    />
                  </td>
                  <td className="px-4 py-3 justify-end whitespace-nowrap">
                    <TableActions>
                      <div
                        id="table-dropdown"
                        className="absolute w-44 right-0 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <Link
                              href={`/product/${product.pno}`}
                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              상품보기
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/admin/products/${product.pno}`}
                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              제품정보 편집
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </TableActions>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center px-4 py-3 text-gray-500 dark:text-white">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <PageComponent pagingData={paging} size={10} search={search} changePage={changePage} />
      </div>
    </div>
  );
}
