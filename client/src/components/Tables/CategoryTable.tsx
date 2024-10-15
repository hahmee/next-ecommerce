    "use client";
    import React, {Fragment, useEffect, useState} from "react";
    import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
    import {DataResponse} from "@/interface/DataResponse";
    import {Category} from "@/interface/Category";
    import Link from "next/link";
    import {fetchWithAuth} from "@/utils/fetchWithAuth";
    import toast from "react-hot-toast";
    import Image from "next/image";
    import {ChevronDownIcon, ChevronUpIcon, EllipsisHorizontalIcon} from "@heroicons/react/20/solid";
    import Dialog from "@/components/Admin/Dialog";
    import TableSearch from "@/components/Tables/TableSearch";
    import TableAddButton from "@/components/Tables/TableAddButton";
    import ActionButton from "@/components/Tables/ActionButton";
    import FilterButton from "@/components/Tables/FilterButton";
    import {PageResponse} from "@/interface/PageResponse";
    import {Paging} from "@/interface/Paging";
    import {initalPagingData} from "@/components/Tables/ProductTable";
    import PageComponent from "@/components/Tables/PageComponent";
    import {getAdminCategories} from "@/app/(admin)/admin/products/_lib/getAdminCategories";


    const CategoryTable = () => {
        const [paging, setPaging] = useState<Paging>(initalPagingData);
        const [expandedRows, setExpandedRows] = useState<number[]>([]);
        const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>({}); // manage dropdown state
        const queryClient = useQueryClient();
        const [deleteId, setDeleteId] = useState<number>(-1);
        const [showDialog, setShowDialog] = useState<boolean>(false);
        const [categoryData, setCategoryData] = useState<PageResponse<Category>>();
        const [page, setPage] = useState<number>(1);
        const [size, setSize] = useState<number>(10);
        const [search, setSearch] = useState<string>("");

        const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<PageResponse<Category>>, Object, PageResponse<Category>, [_1: string, _2: Object]>({
            queryKey: ['categories', {page, size, search}],
            queryFn: () => getAdminCategories( {page, size, search}),
            staleTime: 60 * 1000,
            gcTime: 300 * 1000,
            throwOnError: false,
            select: (data) => {
                // 데이터 가공 로직만 처리
                return data.data;
            }
        });

        useEffect(() => {
            console.log('data', data);

            setCategoryData(data);
            if (data) {

                const {dtoList, ...otherData} = data;
                setPaging(otherData);
            }
        }, [data]);

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
        const deleteCategory = () => {
            mutation.mutate(deleteId);
        }

        // 행 클릭 시 확장 여부 토글
        const toggleRow = (id: number) => {
            console.log('id', id);

            setExpandedRows((prevExpandedRows) =>
                prevExpandedRows.includes(id)
                    ? prevExpandedRows.filter((rowId) => rowId !== id)
                    : [...prevExpandedRows, id]
            );
        };

        useEffect(() => {
            console.log('expandedRows', expandedRows);

        }, [expandedRows]);

        // Toggle dropdown modal for each category
        const toggleDropdown = (id: number) => {
            console.log('id', id);
            setDropdownOpen((prevState) => ({
                ...prevState,
                [id]: !prevState[id], // toggle the dropdown for specific category
            }));
        };
        // 검색어에 따라 필터링된 카테고리
        // const filterCategories = (categories: Category[] = []): Category[] => {
        //     return categories.map((category) => {
        //         // 하위 카테고리도 필터링
        //             const filteredSubCategories = category.subCategories
        //                 ? filterCategories(category.subCategories)
        //                 : [];
        //
        //         // 현재 카테고리와 필터링된 하위 카테고리를 포함
        //         if (
        //             category.cname.toLowerCase().includes(search.toLowerCase()) ||
        //             category.cdesc.toLowerCase().includes(search.toLowerCase()) ||
        //             filteredSubCategories.length > 0
        //         ) {
        //             return {
        //                 ...category,
        //                 subCategories: filteredSubCategories,
        //             };
        //         }
        //
        //         // 검색어에 맞지 않으면 빈 배열 반환
        //         return null;
        //     }).filter((category) => category !== null) as Category[];
        // };

        // 재귀적으로 하위 카테고리를 렌더링하는 함수
        const renderCategoryRows = (categories: Category[], depth: number = 0) => {
            return categories.map((category) => (
                <Fragment key={category.cno}>
                    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => toggleRow(category.cno)}>
                        <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox"
                                       className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-meta-4 dark:border-gray-600"/>
                                <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-2" style={{paddingLeft: `${depth * 20}px`}}>
                            <div className="w-7">
                            {
                                category.subCategories  &&  (
                                    expandedRows.includes(category.cno) ? <ChevronUpIcon className="h-7 w-7 text-gray-500"/>
                                        :
                                        <ChevronDownIcon className="h-7 w-7 text-gray-500"/>
                                )
                            }
                            </div>
                            <Image
                                src={category.uploadFileName || "https://via.placeholder.com/640x480"}
                                width={500}
                                height={500}
                                className="object-cover w-15 h-10 flex-none"
                                alt="Picture of category"
                            />
                            <div className="line-clamp-1">
                                {category.cname}

                            </div>
                        </th>
                        <td className="px-4 py-3 whitespace-nowrap">
                            {category.cdesc}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                            {category.subCategories ? category.subCategories.length : "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                            사용중
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
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
            setSearch(value);  // 검색어 업데이트
        };

        const changeSize = (size: number) => {
            setSize(size);
        };

        const changePage = (page: number) => {
            setPage(page);
        };

        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden">
                <div
                    className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                        <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
                    </div>
                    <div
                        className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <TableAddButton content={"Add Main Category"} location={"/admin/category/add-category"}/>
                        <div className="flex items-center space-x-3 w-full md:w-auto">
                            <ActionButton/>
                            <FilterButton changeSize={changeSize}/>
                        </div>
                    </div>

                </div>

                {showDialog && <Dialog content={"정말 삭제하시겠습니까?"} clickModal={clickModal} showDialog={showDialog}
                                       doAction={deleteCategory}/>}

                {/* 카테고리 테이블 */}
                <div className="w-auto overflow-x-auto overflow-y-hidden relative">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 relative">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4 py-3">
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
                            <th scope="col" className="px-4 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {categoryData?.dtoList && renderCategoryRows(categoryData.dtoList || [])}
                        {/*{categoryData?.dtoList && renderCategoryRows(filterCategories(categoryData.dtoList || []))}*/}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-6 md:px-6 xl:px-7.5">
                    <PageComponent pagingData={paging} size={size} search={search} changePage={changePage}/>
                </div>
            </div>
        );
    };

    export default CategoryTable;
