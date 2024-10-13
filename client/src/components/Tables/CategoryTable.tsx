    "use client";
    import React, {Fragment, useState} from "react";
    import {useRouter} from "next/navigation";
    import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
    import {DataResponse} from "@/interface/DataResponse";
    import {Category} from "@/interface/Category";
    import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
    import Link from "next/link";
    import {fetchWithAuth} from "@/utils/fetchWithAuth";
    import toast from "react-hot-toast";
    import Image from "next/image";
    import {ChevronDownIcon} from "@heroicons/react/20/solid";
    import {EllipsisHorizontalIcon} from "@heroicons/react/20/solid";
    import Dialog from "@/components/Admin/Dialog";
    import TableSearch from "@/components/Tables/TableSearch";


    const CategoryTable = () => {
        const [expandedRows, setExpandedRows] = useState<number[]>([]);
        const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>({}); // manage dropdown state
        const queryClient = useQueryClient();
        const [deleteId, setDeleteId] = useState<number>(-1);
        const [showDialog, setShowDialog] = useState<boolean>(false);
        const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
        const router = useRouter();

        const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
            queryKey: ['categories'],
            queryFn: () => getCategories(),
            staleTime: 60 * 1000,
            gcTime: 300 * 1000,
            throwOnError: false,
            select: (data) => {
                // 데이터 가공 로직만 처리
                return data.data;
            }
        });

        const mutation = useMutation({
            mutationFn: async (cno: number) => {
                return fetchWithAuth(`/api/category/${cno}`, {
                    method: "DELETE",
                    credentials: 'include',
                });
            },
            onSuccess: (data) => {
                console.log('data...', data);
                clickModal();
                toast.success('삭제되었습니다..');
                //queryClient.invalidateQueries가 호출되어 해당 쿼리가 무효화됩니다.
                // 그러면 useQuery가 다시 실행되어 최신 데이터를 가져옵니다.
                queryClient.invalidateQueries({queryKey: ['categories']});
            }

        });

        // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
        const clickModal = () => setShowDialog(!setShowDialog);

        //삭제
        const deleteProduct = () => {
            mutation.mutate(deleteId);
        }

        // 행 클릭 시 확장 여부 토글
        const toggleRow = (id: number) => {
            setExpandedRows((prevExpandedRows) =>
                prevExpandedRows.includes(id)
                    ? prevExpandedRows.filter((rowId) => rowId !== id)
                    : [...prevExpandedRows, id]
            );
        };

        // Toggle dropdown modal for each category
        const toggleDropdown = (id: number) => {
            console.log('id', id);
            setDropdownOpen((prevState) => ({
                ...prevState,
                [id]: !prevState[id], // toggle the dropdown for specific category
            }));
        };
        // 검색어에 따라 필터링된 카테고리
        const filterCategories = (categories: Category[] = []): Category[] => {
            return categories.map((category) => {
                // 하위 카테고리도 필터링
                    const filteredSubCategories = category.subCategories
                        ? filterCategories(category.subCategories)
                        : [];

                // 현재 카테고리와 필터링된 하위 카테고리를 포함
                if (
                    category.cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    category.cdesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    filteredSubCategories.length > 0
                ) {
                    return {
                        ...category,
                        subCategories: filteredSubCategories,
                    };
                }

                // 검색어에 맞지 않으면 빈 배열 반환
                return null;
            })
                .filter((category) => category !== null) as Category[];
        };

        // 재귀적으로 하위 카테고리를 렌더링하는 함수
        const renderCategoryRows = (categories: Category[], depth: number = 0) => {
            return categories.map((category) => (
                <Fragment key={category.cno}>
                    <tr className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => toggleRow(category.cno)}>
                        <td className="w-3 px-4 py-3">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox"
                                       className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-meta-4 dark:border-gray-600"/>
                                <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        {/*{style={{paddingLeft: `${depth * 20}px`}}}*/}
                        <td scope="row" className="px-4 font-medium dark:text-white "
                            style={{paddingLeft: `${depth * 20}px`}}>
                            <div className="flex items-center">
                                <ChevronDownIcon className="h-7 w-7 mx-4"/>
                                <Image
                                    src={category.uploadFileName || "https://via.placeholder.com/640x480"}
                                    width={40}
                                    height={20}
                                    className="object-cover mr-2"
                                    alt="Picture of category"
                                />
                                <div className="line-clamp-1">
                                    {category.cname}

                                </div>
                            </div>
                        </td>
                        <td className="px-4 line-clamp-1 dark:text-white ">
                            {category.cdesc}
                            loremasdfjalsdkfja;lsdkfjal;sdkfja;sldfkja;sldfkasdfsd
                            loremasdfjalsdkfja;lsdkfjal;sdkfja;sldfkja;sldfkasdfsd
                            loremasdfjalsdkfja;lsdkfjal;sdkfja;sldfkja;sldfkasdfsd
                            loremasdfjalsdkfja;lsdkfjal;sdkfja;sldfkja;sldfkasdfsd
                        </td>
                        <td className="px-4 dark:text-white">
                            {category.subCategories ? category.subCategories.length : "-"}
                        </td>
                        <td className="px-4 dark:text-white">
                            사용중
                        </td>
                        <td className="px-4 dark:text-white">
                            <button
                                id={`category-dropdown-${category.cno}`}
                                className="text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button"
                                onClick={() => toggleDropdown(category.cno)} // toggle the dropdown
                            >
                                <EllipsisHorizontalIcon className="h-6 w-6"/>
                            </button>
                            {dropdownOpen[category.cno] && (
                                <div
                                    className="absolute right-0 z-50 w-44 rounded divide-y divide-gray-100 shadow text-xs text-gray-700 bg-gray-50 dark:bg-meta-4 dark:text-gray-400">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby={`category-dropdown-${category.cno}`}>
                                        <Link href={`/admin/category/add-category/${category.cno}`}
                                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            서브 카테고리 추가
                                        </Link>
                                        <Link href={`/admin/category/edit-category/${category.cno}`}
                                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            수정
                                        </Link>
                                    </ul>
                                    <div className="py-1">
                                        <div
                                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                            onClick={() => {
                                                setShowDialog(true);
                                                setDeleteId(category.cno);
                                            }}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            )}
                        </td>
                        {/*<td className="px-4 border-b-gray-500 font-medium text-gray-900 dark:text-white"></td>*/}
                    </tr>
                    {expandedRows.includes(category.cno) && category.subCategories && (
                        renderCategoryRows(category.subCategories, depth + 1)
                    )}
                </Fragment>
            ));
        };

        // 특정 카테고리를 찾아 서브 카테고리를 추가하는 함수
        const addSubCategory = (categories: Category[], parentId: number, newCategory: Category): Category[] => {
            return categories?.map(category => {
                if (category.cno === parentId) {
                    return {
                        ...category,
                        subCategories: category.subCategories
                            ? [...category.subCategories, newCategory]
                            : [newCategory],
                    };
                }
                if (category.subCategories) {
                    return {
                        ...category,
                        subCategories: addSubCategory(category.subCategories, parentId, newCategory),
                    };
                }
                return category;
            });
        };

        const handleSearch = (value:string) => {
            // setSearchTerm(value);  // 검색어 업데이트
        };
        return (
            <div
                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div
                    className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                    <div className="flex items-center flex-1 space-x-4 bg-ecom w-full">
                        <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
                    </div>
                    <div
                        className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
                        <button type="button" onClick={() => router.push(`/admin/category/add-category`)}
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd"
                                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                            </svg>
                            메인 카테고리 추가
                        </button>
                    </div>
                </div>

                {/*<input*/}
                {/*    type="text"*/}
                {/*    placeholder="카테고리 검색"*/}
                {/*    value={searchTerm}*/}
                {/*    onChange={(e) => setSearchTerm(e.target.value)}*/}
                {/*    className="mb-4 p-2 border border-gray-300 rounded w-full"*/}
                {/*/>*/}


                {showDialog && <Dialog content={"정말 삭제하시겠습니까?"} clickModal={clickModal} showDialog={showDialog} doAction={deleteProduct}/>}

                {/* 카테고리 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-meta-4 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input id="checkbox-all" type="checkbox"
                                           className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-meta-4 dark:border-gray-600"/>
                                    <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-3">카테고리명</th>
                            <th scope="col" className="px-4 py-3">설명</th>
                            <th scope="col" className="px-4 py-3">서브 카테고리</th>
                            <th scope="col" className="px-4 py-3">사용여부</th>
                            <th scope="col" className="px-4 py-3"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {data && renderCategoryRows(filterCategories(data || []))}
                        </tbody>
                    </table>

                </div>
            </div>
        );
    };

    export default CategoryTable;
