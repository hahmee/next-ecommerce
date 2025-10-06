'use client';

import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageResponse } from '@/interface/PageResponse';
import { Product } from '@/interface/Product';
import PageComponent from '@/components/Admin/Tables/PageComponent';
import { Paging } from '@/interface/Paging';
import TableAddButton from '@/components/Admin/Tables/TableAddButton';
import ViewButton from '@/components/Admin/Tables/ViewButton';
import { SalesStatus } from '@/types/salesStatus';
import React, { useEffect, useState } from 'react';
import TableSearch from '@/components/Admin/Tables/TableSearch';
import { StarIcon } from '@heroicons/react/20/solid';
import TableActions from '@/components/Admin/Tables/TableActions';
import Link from 'next/link';
import { getProductsByEmail } from '@/apis/adminAPI';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { fetcher } from '@/utils/fetcher/fetcher';
import {salesOptions} from "@/components/Admin/Product/presets";

const Dialog = dynamic(() => import('../Dialog'));

export const initalPagingData: Paging = {
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
  prev: false,
  next: false,
  pageNumList: [0],
};

const ProductTable = () => {
  const [paging, setPaging] = useState<Paging>(initalPagingData);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [currentPno, setCurrentPno] = useState<number>(-1);
  const [productData, setProductData] = useState<PageResponse<Product>>();
  const [deleteId, setDeleteId] = useState<number>(-1);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { isFetched, isLoading, isFetching, data, error, isError } = useQuery<
    PageResponse<Product>,
    Object,
    PageResponse<Product>,
    [_1: string, _2: Object]
  >({
    queryKey: ['adminProducts', { page, size, search }],
    queryFn: () => getProductsByEmail({ page, size, search }),
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
    // 오직 서버 에러만 에러 바운더리로 전달된다.
    // throwOnError: (error) => error. >= 500,
    throwOnError: true,
  });

  useEffect(() => {
    if (data) {
      setProductData(data);
      const { dtoList, ...otherData } = data;
      setPaging(otherData);
    }
  }, [data]);

  const handleSearch = (value: string) => {
    setSearch(value); // 검색어 업데이트
    value && setPage(1);
  };

  const changeSize = (size: number) => {
    setSize(size);
    setPage(1);
  };

  const changePage = (page: number) => {
    setPage(page);
  };

  const mutation = useMutation({
    mutationFn: async (pno: number) => {
      return fetcher(`/api/products/${pno}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    },
    onMutate: async (pno) => {
      // 기존 데이터 가져오기
      const previousData: PageResponse<Product> | undefined = queryClient.getQueryData([
        'adminProducts',
        { page, size, search },
      ]);

      if (previousData) {
        const updatedData: PageResponse<Product> = {
          ...previousData,
          dtoList: previousData.dtoList.filter((product) => product.pno != pno),
        };

        // 쿼리 데이터를 업데이트
        queryClient.setQueryData(['adminProducts', { page, size, search }], updatedData);
        setProductData(updatedData);
      }
    },
    onSuccess: (data) => {
      toast.success('삭제되었습니다.');
      clickModal();
    },
  });

  // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  const clickModal = () => setShowDialog(!setShowDialog);

  // 삭제
  const deleteProduct = () => {
    mutation.mutate(deleteId);
  };

  // if (isLoading || isFetching) {
  //     return <TableSkeleton/>;
  // }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm ">
      {showDialog && (
        <Dialog
          content="정말 삭제하시겠습니까?"
          clickModal={clickModal}
          showDialog={showDialog}
          doAction={deleteProduct}
        />
      )}

      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/2">
          <TableSearch onSearch={handleSearch} placeholder="Search product name" />{' '}
          {/* 검색어 전달 */}
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <TableAddButton
            content="Add Product"
            location="/admin/products/add-product"
            ariaLabel="Add Product"
          />
          <div className="flex items-center space-x-3 w-full md:w-auto">
            {/* <FilterButton/> */}
            <ViewButton changeSize={changeSize} />
          </div>
        </div>
      </div>

      <div className="w-auto overflow-x-auto overflow-y-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                상품이름
              </th>
              <th scope="col" className="px-4 py-3">
                카테고리
              </th>
              <th scope="col" className="px-4 py-3">
                Sales/Day
              </th>
              <th scope="col" className="px-4 py-3">
                Sales/Month
              </th>
              <th scope="col" className="px-4 py-3">
                SKU
              </th>
              <th scope="col" className="px-4 py-3">
                평점
              </th>
              <th scope="col" className="px-4 py-3">
                판매
              </th>
              <th scope="col" className="px-4 py-3">
                Revenue
              </th>
              <th scope="col" className="px-4 py-3">
                가격
              </th>
              <th scope="col" className="px-4 py-3">
                재고현황
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {productData?.dtoList && productData?.dtoList.length > 0 ? (
              productData?.dtoList?.map((product, key) => (
                <tr
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  key={key}
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link
                      href={`/admin/products/${product.pno}`}
                      className="flex items-center gap-2"
                    >
                      {product.uploadFileNames && product.uploadFileNames.length > 0 && (
                        <Image
                          src={product.uploadFileNames[0]?.file}
                          width={500}
                          height={500}
                          className="object-cover w-15 h-10 flex-none"
                          alt="Product"
                        />
                      )}
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
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${product.salesStatus === SalesStatus.ONSALE ? 'bg-green-400' : product.salesStatus === SalesStatus.STOPSALE ? 'bg-red-400' : 'bg-yellow-300'}`}
                      />
                      {salesOptions.find((option) => option.id === product.salesStatus)?.content}
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
                          <div
                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            onClick={(e) => {
                              setShowDialog(true);
                              setDeleteId(product.pno);
                            }}
                          >
                            삭제하기
                          </div>
                        </div>
                      </div>
                    </TableActions>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  scope="row"
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
        <PageComponent pagingData={paging} size={size} search={search} changePage={changePage} />
      </div>
    </div>
  );
};

export default ProductTable;
