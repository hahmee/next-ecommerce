// src/entities/category/ui/CategoryTableView.tsx

// src/entities/category/ui/CategoryTableView.tsx

'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react';

import { CategoryTree } from '@/entities/category/model/categoryTree';
import type { Paging } from '@/entities/order/model/Paging';
import PageComponent from '@/widgets/admin/table-kit/ui/PageComponent';
import TableActions from '@/widgets/admin/table-kit/ui/TableActions';
import TableAddButton from '@/widgets/admin/table-kit/ui/TableAddButton';
import TableSearch from '@/widgets/admin/table-kit/ui/TableSearch';
import ViewButton from '@/widgets/admin/table-kit/ui/ViewButton';

const Dialog = dynamic(() => import('@/shared/ui/Dialog'), { ssr: false });
export function CategoryTableView(props: {
  dtoList: CategoryTree[];
  paging: Paging;
  expandedRows: number[];
  dropdownOpen: Record<number, boolean>;
  showDialog: boolean;
  page: number;
  size: number;
  search: string;
  setDeleteId: (id: number) => void;
  handleSearch: (v: string) => void;
  changeSize: (n: number) => void;
  changePage: (n: number) => void;
  clickModal: () => void;
  toggleRow: (id: number) => void;
  toggleDropdown: (id: number) => void;
  deleteCategory: () => void;
}) {
  const {
    dtoList,
    paging,
    size,
    expandedRows,
    dropdownOpen,
    showDialog,
    setDeleteId,
    handleSearch,
    changeSize,
    changePage,
    clickModal,
    toggleRow,
    toggleDropdown,
    deleteCategory,
  } = props;

  const renderRows = (categories: CategoryTree[], depth = 0) =>
    categories.map((category) => (
      <Fragment key={category.cno}>
        <tr
          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => toggleRow(category.cno)}
        >
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center">
              <input id={`cb-${category.cno}`} type="checkbox" className="w-4 h-4" />
              <label htmlFor={`cb-${category.cno}`} className="sr-only">
                checkbox
              </label>
            </div>
          </td>

          <th
            scope="row"
            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-2"
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            <div className="w-7">
              {!!category.subCategories?.length &&
                (expandedRows.includes(category.cno) ? (
                  <ChevronUpIcon className="h-7 w-7 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-7 w-7 text-gray-500" />
                ))}
            </div>
            <Image
              src={category.uploadFileName || '/images/mall/no_image.png'}
              width={500}
              height={500}
              className="object-cover w-15 h-10 flex-none"
              alt="Category"
            />
            <div className="line-clamp-1">{category.cname}</div>
          </th>

          <td className="px-4 py-3 whitespace-nowrap">{category.cdesc}</td>
          <td className="px-4 py-3 whitespace-nowrap">{category.subCategories?.length ?? '-'}</td>
          <td className="px-4 py-3 whitespace-nowrap">사용중</td>

          <td className="px-4 py-3 whitespace-nowrap">
            <TableActions>
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 z-10 w-44 rounded divide-y divide-gray-100 shadow text-xs text-gray-700 bg-gray-50 dark:bg-meta-4 dark:text-gray-400"
              >
                <ul className="py-1 text-sm">
                  <Link
                    href={`/admin/category/add-category/${category.cno}`}
                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    서브 카테고리 추가
                  </Link>
                  <Link
                    data-testid="edit-link"
                    aria-label="edit-link"
                    href={`/admin/category/edit-category/${category.cno}`}
                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    수정
                  </Link>
                </ul>
                <div className="py-1">
                  <button
                    data-testid="delete"
                    aria-label="delete"
                    className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => {
                      setDeleteId(category.cno);
                      clickModal();
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </TableActions>
          </td>
        </tr>

        {expandedRows.includes(category.cno) &&
          !!category.subCategories?.length &&
          renderRows(category.subCategories, depth + 1)}
      </Fragment>
    ));

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4">
        <div className="w-full md:w-1/2">
          <TableSearch onSearch={handleSearch} placeholder="Search category name" />
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <TableAddButton content="Add Main Category" location="/admin/category/add-category" />
          <ViewButton changeSize={changeSize} />
        </div>
      </div>

      {showDialog && (
        <Dialog
          content="정말 삭제하시겠습니까?"
          clickModal={clickModal}
          showDialog={showDialog}
          doAction={deleteCategory}
        />
      )}

      <div className="w-auto overflow-x-auto overflow-y-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="p-4 py-3" />
              <th className="px-4 py-3">카테고리명</th>
              <th className="px-4 py-3">설명</th>
              <th className="px-4 py-3">서브 카테고리</th>
              <th className="px-4 py-3">사용여부</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {dtoList.length > 0 ? (
              renderRows(dtoList)
            ) : (
              <tr>
                <td colSpan={6} className="text-center px-4 py-6">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <PageComponent pagingData={paging} size={size} search={''} changePage={changePage} />
      </div>
    </div>
  );
}
