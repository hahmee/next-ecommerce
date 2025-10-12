'use client';

import { StarIcon } from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import { salesOptions } from '@/features/product/manage/consts/presets';
import PageComponent from '@/widgets/admin/table-kit/ui/PageComponent';
import TableActions from '@/widgets/admin/table-kit/ui/TableActions';
import TableAddButton from '@/widgets/admin/table-kit/ui/TableAddButton';
import TableSearch from '@/widgets/admin/table-kit/ui/TableSearch';
import ViewButton from '@/widgets/admin/table-kit/ui/ViewButton';
import type { Paging } from '@/entities/order/model/Paging';
import type { Product } from '@/entities/product/model/types';

const Dialog = dynamic(() => import('../Dialog'));

export function ProductTableView(props: {
  rows: Product[];
  paging: Paging;
  page: number;
  size: number;
  search: string;
  showDialog: boolean;
  deleteId: number | null;
  handleSearch: (v: string) => void;
  changeSize: (n: number) => void;
  changePage: (n: number) => void;
  clickModal: () => void;
  requestDelete: (pno: number) => void;
  confirmDelete: () => void;
}) {
  const {
    rows,
    paging,
    size,
    handleSearch,
    changeSize,
    changePage,
    showDialog,
    clickModal,
    requestDelete,
    confirmDelete,
  } = props;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm ">
      {showDialog && (
        <Dialog
          content="정말 삭제하시겠습니까?"
          clickModal={clickModal}
          showDialog={showDialog}
          doAction={confirmDelete}
        />
      )}

      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/2">
          <TableSearch onSearch={handleSearch} placeholder="Search product name" />
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <TableAddButton
            content="Add Product"
            location="/admin/products/add-product"
            ariaLabel="Add Product"
          />
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <ViewButton changeSize={changeSize} />
          </div>
        </div>
      </div>

      <div className="w-auto overflow-x-auto overflow-y-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">상품이름</th>
              <th className="px-4 py-3">카테고리</th>
              <th className="px-4 py-3">Sales/Day</th>
              <th className="px-4 py-3">Sales/Month</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">평점</th>
              <th className="px-4 py-3">판매</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">가격</th>
              <th className="px-4 py-3">재고현황</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((product) => (
                <tr
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  key={product.pno}
                >
                  <th className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <Link
                      href={`/admin/products/${product.pno}`}
                      className="flex items-center gap-2"
                    >
                      {product.uploadFileNames?.length ? (
                        <Image
                          src={product.uploadFileNames[0]?.file}
                          width={500}
                          height={500}
                          className="object-cover w-15 h-10 flex-none"
                          alt="Product"
                        />
                      ) : null}
                      <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {product.pname}
                      </p>
                    </Link>
                  </th>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-primary-100 text-primary-800 text-xs px-1.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                      {product.category?.cname}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">Apple</td>
                  <td className="px-4 py-3 whitespace-nowrap">300</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.sku}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {product.averageRating ? <StarIcon className="w-5 h-5 text-ecom" /> : null}
                      <span>{product.averageRating || '평점없음'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">판매</td>
                  <td className="px-4 py-3 whitespace-nowrap">레베뉴</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.price.toLocaleString()} 원
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${
                          product.salesStatus === 'ONSALE'
                            ? 'bg-green-400'
                            : product.salesStatus === 'STOPSALE'
                              ? 'bg-red-400'
                              : 'bg-yellow-300'
                        }`}
                      />
                      {salesOptions.find((o) => o.id === product.salesStatus)?.content}
                    </div>
                  </td>
                  <td className="px-4 py-3 justify-end whitespace-nowrap">
                    <TableActions>
                      <div
                        id="table-dropdown"
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute right-0 z-10 w-44 rounded divide-y divide-gray-100 shadow text-xs text-gray-700 bg-gray-50 dark:bg-meta-4 dark:text-gray-400 ${showDialog ? 'hidden' : ''}`}
                      >
                        <ul
                          className="py-1 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="table-dropdown-button"
                        >
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
                              수정하기
                            </Link>
                          </li>
                        </ul>
                        <div className="py-1">
                          <button
                            className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            onClick={() => requestDelete(product.pno)}
                          >
                            삭제하기
                          </button>
                        </div>
                      </div>
                    </TableActions>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center px-4 py-3 text-gray-500 whitespace-nowrap dark:text-white"
                >
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <PageComponent
          pagingData={paging}
          size={size}
          search={props.search}
          changePage={changePage}
        />
      </div>
    </div>
  );
}
