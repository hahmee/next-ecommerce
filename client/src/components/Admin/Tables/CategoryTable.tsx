    "use client";
    import React, {Fragment, useEffect, useState} from "react";
    import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
    import {Category} from "@/interface/Category";
    import Link from "next/link";
    import {fetchJWT} from "@/utils/fetchJWT";
    import toast from "react-hot-toast";
    import Image from "next/image";
    import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
    import TableSearch from "@/components/Admin/Tables/TableSearch";
    import TableAddButton from "@/components/Admin/Tables/TableAddButton";
    import ViewButton from "@/components/Admin/Tables/ViewButton";
    import {PageResponse} from "@/interface/PageResponse";
    import {Paging} from "@/interface/Paging";
    import {initalPagingData} from "@/components/Admin/Tables/ProductTable";
    import PageComponent from "@/components/Admin/Tables/PageComponent";
    import TableActions from "@/components/Admin/Tables/TableActions";
    import {getAdminCategories} from "@/apis/adminAPI";
    import dynamic from "next/dynamic";
    import {unwrap} from "@/utils/unwrap";

    const Dialog = dynamic(() => import('../../Admin/Dialog'));

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

        const { isFetched, isFetching, data, error, isError} = useQuery<PageResponse<Category>, Object, PageResponse<Category>, [_1: string, _2: Object]>({
            queryKey: ['adminCategories', {page, size, search}],
            queryFn: () => getAdminCategories( {page, size, search}),
            staleTime: 60 * 1000,
            gcTime: 300 * 1000,
            throwOnError: true,
        });

        useEffect(() => {
            if (data) {
                setCategoryData(data);
                const {dtoList, ...otherData} = data;
                setPaging(otherData);
            }
        }, [data]);

        const mutation = useMutation({
            mutationFn: async (cno: number) => {
                return unwrap(await fetchJWT(`/api/category/${cno}`, {
                    method: "DELETE",
                    credentials: 'include',
                }));
            },
            onMutate: async (cno) => {

                // Get previous value of the query data
                // const previousData: DataResponse<PageResponse<Category>> | undefined = queryClient.getQueryData(['adminCategories', {page, size, search}]);
                //
                // if(previousData) {
                //     const updatedData: PageResponse<Category> = {
                //         ...previousData.data,
                //         dtoList: previousData.data.dtoList.filter(category => category.cno !== cno),
                //     };
                //
                //     // 쿼리 데이터를 업데이트
                //     queryClient.setQueryData(['adminCategories', {page, size, search}], updatedData);
                //
                //
                // }

            },

            onSuccess: (data) => {

                const deletedCno: Array<number> = data; //삭제된 cno

                // 기존 데이터 가져오기
                const previousData: PageResponse<Category> | undefined = queryClient.getQueryData(['adminCategories', {page, size, search}]);

                console.log('previousData', previousData);
                // 새로운 데이터로 업데이트
                if (previousData) {
                    const updatedData: PageResponse<Category> = {
                        ...previousData,
                        dtoList: previousData.dtoList.filter(category => !deletedCno.includes(category.cno)),
                    };

                    // 쿼리 데이터를 업데이트
                    queryClient.setQueryData(['adminCategories', {page, size, search}], updatedData);

                    // 상태도 업데이트
                    setCategoryData(updatedData);
                    toast.success('삭제되었습니다.');
                    clickModal();
                }

                //queryClient.invalidateQueries가 호출되어 해당 쿼리가 무효화됩니다.
                // 그러면 useQuery가 다시 실행되어 최신 데이터를 가져옵니다.
                // queryClient.invalidateQueries({queryKey: ['categories']}); //네트워크 요청


                //


            },
            onError(error) {

                toast.error(`오류 발생: ${error}`);
            },


        });

        // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
        const clickModal = () => setShowDialog(!setShowDialog);

        //삭제
        const deleteCategory = () => {
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
                    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => toggleRow(category.cno)}>
                        <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox"
                                       className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-meta-4 dark:border-gray-600"/>
                                <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <th scope="row"
                            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-2"
                            style={{paddingLeft: `${depth * 20}px`}}>
                            <div className="w-7">
                                {
                                    category.subCategories && (
                                        expandedRows.includes(category.cno) ?
                                            <ChevronUpIcon className="h-7 w-7 text-gray-500"/>
                                            :
                                            <ChevronDownIcon className="h-7 w-7 text-gray-500"/>
                                    )
                                }
                            </div>
                            <Image
                                src={category.uploadFileName || "/images/mall/no_image.png"}
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
                                <TableActions>
                                    <div id="table-dropdown" onClick={(e) => e.stopPropagation()} className={`absolute right-0 z-10 w-44 rounded divide-y divide-gray-100 shadow text-xs text-gray-700 bg-gray-50 dark:bg-meta-4 dark:text-gray-400 ${showDialog ? "hidden" : ""}`}>
                                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby="table-dropdown-button">
                                            <Link href={`/admin/category/add-category/${category.cno}`} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                서브 카테고리 추가
                                            </Link>
                                            <Link href={`/admin/category/edit-category/${category.cno}`} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                수정
                                            </Link>
                                        </ul>
                                        <div className="py-1">
                                            <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                                onClick={() => {
                                                    setShowDialog(true);
                                                    setDeleteId(category.cno);
                                                }}>
                                                삭제
                                            </div>
                                        </div>
                                    </div>

                                </TableActions>

                        </td>
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
            value && setPage(1);
        };

        const changeSize = (size: number) => {
            setSize(size);
            setPage(1);
        };

        const changePage = (page: number) => {
            setPage(page);
        };

        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm">
                <div
                    className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                        <TableSearch onSearch={handleSearch} placeholder="Search category name"/> {/* 검색어 전달 */}
                    </div>
                    <div
                        className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <TableAddButton content={"Add Main Category"} location={"/admin/category/add-category"}/>
                        <div className="flex items-center space-x-3 w-full md:w-auto">
                            {/*<FilterButton/>*/}
                            <ViewButton changeSize={changeSize}/>
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
                        {(categoryData?.dtoList && categoryData?.dtoList.length > 0) ? renderCategoryRows(categoryData.dtoList || [])
                            : <tr>
                                <td scope="row" colSpan={11}
                                    className="text-center px-4 py-3 text-gray-500 whitespace-nowrap dark:text-white">
                                    No results
                                </td>
                            </tr>
                        }
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
