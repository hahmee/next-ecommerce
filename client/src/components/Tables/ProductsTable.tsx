"use client";
import Image from "next/image";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PageResponse} from "@/interface/PageResponse";
import {Product} from "@/interface/Product";
import PageComponent from "@/components/Tables/PageComponent";
import {PageParam} from "@/interface/PageParam";
import {Paging} from "@/interface/Paging";
import AddProductButton from "@/components/Tables/AddProductButton";
import ActionButton from "@/components/Tables/ActionButton";
import FilterButton from "@/components/Tables/FilterButton";
import {DataResponse} from "@/interface/DataResponse";
import {useRouter} from "next/navigation";
import {salesOptions} from "@/components/Admin/Product/ProductForm";
import {SalesStatus} from "@/types/salesStatus";
import {useEffect, useState} from "react";
import Link from "next/link";
import TableSearch from "@/components/Tables/TableSearch";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import Dialog from "@/components/Admin/Dialog";

const initalPagingData: Paging = {
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0,
    prev: false,
    next: false,
    pageNumList: [0],
}
const ProductTable = ({page, size, search} : PageParam) => {

    const [paging, setPaging] = useState<Paging>(initalPagingData);

    const queryClient = useQueryClient();

    const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<PageResponse<Product>>, Object, PageResponse<Product>, [_1: string, _2: Object]>({
        queryKey: ['adminProducts', {page, size, search}],
        queryFn: () => getProductsByEmail({page, size, search}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        throwOnError: false,
        select: (data) => {
            return data.data;
        }
    });

    const [currentPno, setCurrentPno] = useState<number>(-1);
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 관리
    const [productData, setProductData] = useState<PageResponse<Product>>();

    const [deleteId, setDeleteId] = useState<number>(-1);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const router = useRouter();

    const handleClick = (pno:number) => {
        router.push(`/admin/products/${pno}`);
    }

    useEffect(() => {
        setProductData(data);
        if (data) {
            const {dtoList, ...otherData} = data;
            setPaging(otherData);
        }
    }, [data]);

    // return <div>ㅎㅎ</div>
    // if(data?.message) {
    // //리다이렉트
    // return <div>dd</div>
    // }
    //
    // const productData = data?.data.dtoList;
    // const productData = null;



    // if (error) return 'An error has occurred: ' + error.message;
    // React.useEffect(() => {
    //     if (adminProducts.error) {
    //         adminProducts.error(`Something went wrong: ${todos.error.message}`);
    //     }
    // }, [todos.error]);

    const handleOpenMenu = (pno:number) => {
        setCurrentPno(pno);
    }

    const handleSearch = (value:string) => {
        setSearchTerm(value);  // 검색어 업데이트
    };


    // 검색어 변경 시 검색 API 호출
    useEffect(() => {

        // if (searchTerm) {
            const fetchSearchResults = async () => {
                const resultJson = await fetchWithAuth(`/api/products/searchAdminList?page=${page}&size=${size}&search=${searchTerm}`, {
                    method: "GET",
                    credentials: 'include',
                    // cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
                });
                // setSearchResults(resultJson.data);
                setProductData(resultJson.data);
                const {dtoList, ...otherData} = resultJson.data;
                setPaging(otherData);
            };
            fetchSearchResults();
        // }
    }, [searchTerm]);

    const mutation = useMutation({
        mutationFn: async (pno: number) => {
            return fetchWithAuth(`/api/products/${pno}`, {
                method: "DELETE",
                credentials: 'include',
            });
        },
        onSuccess: (data) => {
            console.log('data...', data);
            clickModal();

            //데이터 리프레시
            // await fetchProducts();

            //queryClient.invalidateQueries가 호출되어 해당 쿼리가 무효화됩니다.
            // 그러면 useQuery가 다시 실행되어 최신 데이터를 가져옵니다.
            queryClient.invalidateQueries(['adminProducts', { page, size, search:searchTerm}] as any);
        }

    });

    // if(mutation.isSuccess) {
    //     router.replace("/admin/products?page=1&size=10");
    // }

    // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
    const clickModal = () => setShowDialog(!setShowDialog);

    //삭제
    const deleteProduct = () => {
        mutation.mutate(deleteId);
    }
    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {showDialog && <Dialog content={"정말 삭제하시겠습니까?"} clickModal={clickModal} showDialog={showDialog}
                                   doAction={deleteProduct}/>}

            <div
                className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2 relative">
                    <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
                </div>
                <div
                    className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <AddProductButton/>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <ActionButton/>
                        <FilterButton/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-gray-700 dark:bg-meta-4">
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">상품이름</p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                    <p className="font-medium">카테고리</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">SKU</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">가격</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">재고현황</p>
                </div>

                <div className="col-span-1 flex items-center">

                </div>
            </div>

            {productData?.dtoList?.map((product, key) => (
                <div
                    className="grid grid-cols-6 border-t border-stroke px-4 py-3 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                >
                    <div className="col-span-2 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="h-12.5 w-15 rounded-md">
                                {
                                    (product.uploadFileNames && product.uploadFileNames.length > 0) &&
                                    <Image
                                        src={product.uploadFileNames[0]?.file}
                                        width={500}
                                        height={500}
                                        style={{objectFit: "contain", height: "100%"}}
                                        alt="Product"
                                        onClick={() => handleClick(product.pno)}
                                    />
                                }
                            </div>
                            <p className="text-sm text-black dark:text-white">
                                {product.pname}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 hidden  sm:flex flex-col ">
                        {product.categoryList.map((category, idx) => (
                            <span key={idx}
                                  className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 my-1">
                                {category}
                            </span>
                        ))}
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            {product.sku}
                        </p>
                    </div>
                    {/*<div className="col-span-1 flex items-center">*/}
                    {/*    <p className="text-sm text-black dark:text-white">{product.brand}</p>*/}
                    {/*</div>*/}
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{product.price}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <div
                            className={`inline-block w-4 h-4 mr-2 rounded-full ${product.salesStatus === SalesStatus.ONSALE ? "bg-green-400" : product.salesStatus === SalesStatus.STOPSALE ? "bg-red-400" : "bg-yellow-300"}`}></div>
                        <p className="text-sm text-black dark:text-white">{salesOptions.find(option => option.id === product.salesStatus)?.content}</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                        <button id="apple-imac-27-dropdown-button" data-dropdown-toggle="apple-imac-27-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button" onClick={() => handleOpenMenu(product.pno)}>
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                        </button>

                        {
                            currentPno === product.pno && (
                                <div id="apple-imac-27-dropdown"
                                     className="absolute z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="apple-imac-27-dropdown-button">
                                        <li>
                                            <Link href="/"
                                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</Link>
                                        </li>
                                        <li>
                                            <Link href={`/admin/products/${product.pno}`}
                                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">수정하기</Link>
                                        </li>
                                    </ul>
                                    <div className="py-1">
                                        <div
                                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                            onClick={() => {
                                                setShowDialog(true);
                                                setDeleteId(product.pno);
                                            }}>삭제하기

                                        </div>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                </div>
            ))}

            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <PageComponent pagingData={paging} size={size} search={searchTerm}/>
            </div>
        </div>
    );
};

export default ProductTable;
