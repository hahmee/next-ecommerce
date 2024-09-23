    "use client";
    import {Fragment, useEffect, useState} from "react";
    import {useRouter} from "next/navigation";
    import {useQuery} from "@tanstack/react-query";
    import {DataResponse} from "@/interface/DataResponse";
    import {Category} from "@/interface/Category";
    import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
    import {useCategoryStore} from "@/store/categoryStore";
    import Link from "next/link";


    const CategoryTable = () => {
        const [expandedRows, setExpandedRows] = useState<number[]>([]);
        const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>({}); // manage dropdown state

        const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
        const router = useRouter();
        const {categories, setCategories} = useCategoryStore();

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

        // useEffect를 사용해 데이터를 가져온 후 상태 업데이트
        useEffect(() => {
            if (data) {
                setCategories(data);  // Zustand 스토어에 상태 저장
            }
        }, [data, setCategories]); // data가 업데이트될 때마다 setCategories 실행

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
                    <tr className="cursor-pointer hover:bg-meta-4 dark:hover:bg-gray-700" onClick={() => toggleRow(category.cno)}>
                        <td scope="row" className=" flex items-center px-4 py-3 font-medium text-gray-900 dark:text-white" style={{paddingLeft: `${depth * 20}px`}}>
                            <img
                                src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png"
                                alt="iMac Front Image" className="w-auto h-8 mr-3"/>
                            {category.cname}
                        </td>
                        <td className="px-4 py-3">{category.cdesc}</td>
                        <td className="px-4 py-3">
                            {category.subCategories ? category.subCategories.length : "-"}
                        </td>
                        <td className="px-4 py-3 flex items-center justify-end">
                            <button
                                id={`category-dropdown-${category.cno}`}
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button"
                                onClick={() => toggleDropdown(category.cno)} // toggle the dropdown
                            >
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                                </svg>
                            </button>
                            {/* Dropdown Modal */}
                            {dropdownOpen[category.cno] && (
                                <div className="absolute right-0 z-50 w-44 rounded divide-y divide-gray-100 shadow text-xs text-gray-700 bg-gray-50 dark:bg-meta-4 dark:text-gray-400">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby={`category-dropdown-${category.cno}`}>
                                        <Link href={`/admin/category/add-category/${category.cno}`} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                서브 카테고리 추가
                                        </Link>
                                        <Link href={`/admin/category/edit-category/${category.cno}`} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                수정
                                        </Link>
                                    </ul>
                                    <div className="py-1">
                                        <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            )}
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

        return (
            <div className="p-4">
                {/* 검색창 추가 */}
                <input
                    type="text"
                    placeholder="카테고리 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                />

                {/* 카테고리 추가 버튼 */}
                <button
                    onClick={() => router.push(`/admin/category/add-category`)}
                    className="mb-4 px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"
                >
                    메인 카테고리 추가
                </button>

                {/* 카테고리 테이블 */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-meta-4 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">카테고리명</th>
                                <th scope="col" className="px-4 py-3">설명</th>
                                <th scope="col" className="px-4 py-3">서브 카테고리</th>
                                <th scope="col" className="px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            {data && renderCategoryRows(filterCategories(data || []))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    export default CategoryTable;
