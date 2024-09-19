    "use client";
    import { Fragment, useState } from "react";
    import {useRouter} from "next/navigation";

    // 카테고리 인터페이스 정의
    export interface Category {
        id: number;
        name: string;
        description: string;
        // image: string;
        subCategories?: Category[];
    }

    // 초기 카테고리 데이터
    export const initialCategories: Category[] = [
        {
            id: 1,
            name: "전자제품",
            description: "전자제품 설명",
            subCategories: [
                {
                    id: 2,
                    name: "컴퓨터",
                    description: "컴퓨터 설명",
                    subCategories: [
                        { id: 9, name: "노트북", description: "노트북 설명" },
                        { id: 10, name: "데스크탑", description: "데스크탑 설명" }
                    ]
                },
                { id: 3, name: "스마트폰", description: "스마트폰 설명" },
            ],
        },
        {
            id: 4,
            name: "가전제품",
            description: "가전제품 설명",
            subCategories: [
                {
                    id: 5,
                    name: "세탁기",
                    description: "세탁기 설명",
                    subCategories: [
                        {
                            id: 7,
                            name: "미니 세탁기",
                            description: "미니 세탁기 설명",
                            subCategories: [
                                {
                                    id: 11,
                                    name: "휴대용 세탁기",
                                    description: "휴대용 세탁기 설명",
                                }
                            ]
                        }
                    ]
                },
                { id: 6, name: "냉장고", description: "냉장고 설명" },
            ],
        },
    ];

    const CategoryTable = () => {
        const [categories, setCategories] = useState<Category[]>(initialCategories);
        const [expandedRows, setExpandedRows] = useState<number[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [newCategory, setNewCategory] = useState({ name: "", description: "" });
        const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
        const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
        const router = useRouter();

        // 행 클릭 시 확장 여부 토글
        const toggleRow = (id: number) => {
            setExpandedRows((prevExpandedRows) =>
                prevExpandedRows.includes(id)
                    ? prevExpandedRows.filter((rowId) => rowId !== id)
                    : [...prevExpandedRows, id]
            );
        };

        // 카테고리를 평탄화하여 선택 목록에 사용
        const flattenCategories = (categories: Category[], depth: number = 0, prefix: string = ""): { id: number; name: string }[] => {
            return categories.reduce<{ id: number; name: string }[]>((acc, category) => {
                acc.push({ id: category.id, name: `${prefix}${category.name}` });
                if (category.subCategories && category.subCategories.length > 0) {
                    acc = acc.concat(flattenCategories(category.subCategories, depth + 1, `${prefix}-- `));
                }
                return acc;
            }, []);
        };

        // 검색어에 따라 필터링된 카테고리
        const filterCategories = (categories: Category[]): Category[] => {
            return categories
                .map((category) => {
                    // 하위 카테고리도 필터링
                    const filteredSubCategories = category.subCategories
                        ? filterCategories(category.subCategories)
                        : [];

                    // 현재 카테고리와 필터링된 하위 카테고리를 포함
                    if (
                        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                <Fragment key={category.id}>
                    <tr
                        className="cursor-pointer hover:bg-meta-4 dark:hover:bg-gray-700"
                        onClick={() => toggleRow(category.id)}
                    >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white" style={{ paddingLeft: `${depth * 20}px` }}>
                            {category.name}
                        </td>
                        <td className="px-4 py-3">{category.description}</td>
                        <td className="px-4 py-3">
                            {category.subCategories ? category.subCategories.length : "-"}
                        </td>
                    </tr>
                    {expandedRows.includes(category.id) && category.subCategories && (
                        renderCategoryRows(category.subCategories, depth + 1)
                    )}
                </Fragment>
            ));
        };

        // 특정 카테고리를 찾아 서브 카테고리를 추가하는 함수
        const addSubCategory = (categories: Category[], parentId: number, newCategory: Category): Category[] => {
            return categories.map(category => {
                if (category.id === parentId) {
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

        // 카테고리 추가 함수
        const handleAddCategory = () => {
            if (newCategory.name.trim() === "" || newCategory.description.trim() === "") {
                alert("카테고리명과 설명을 입력해주세요.");
                return;
            }

            const newCategoryObj: Category = {
                id: Date.now(),
                name: newCategory.name,
                description: newCategory.description,
            };

            if (parentCategoryId === null) {
                setCategories([...categories, newCategoryObj]);
            } else {
                const updatedCategories = addSubCategory(categories, parentCategoryId, newCategoryObj);
                setCategories(updatedCategories);
            }

            setIsModalOpen(false);
            setNewCategory({ name: "", description: "" });
            setParentCategoryId(null);
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
                    // onClick={() => setIsModalOpen(true)}
                    onClick={() => router.push(`/admin/category/add-category`)}
                    className="mb-4 px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"
                >
                    카테고리 관리
                </button>

                {/* 모달 */}
                {/*{isModalOpen && (*/}
                {/*    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">*/}
                {/*        <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-[600px] flex">*/}

                {/*            /!* Left side: Category List *!/*/}
                {/*            <div className="w-1/3 border-r pr-4">*/}
                {/*                <h2 className="text-lg font-semibold mb-4">새 카테고리</h2>*/}
                {/*                <ul className="space-y-2">*/}
                {/*                    {flattenCategories(categories).map((cat) => (*/}
                {/*                        <li key={cat.id} className="pl-4">*/}
                {/*                            <span className="cursor-pointer">{cat.name}</span>*/}
                {/*                        </li>*/}
                {/*                    ))}*/}
                {/*                </ul>*/}
                {/*                <p className="text-xs text-red-500 mt-4">*/}
                {/*                    *스타터 버전 이상 유료 사용자의 경우, 여러 개의 카테고리를 추가할 수 있습니다.*/}
                {/*                </p>*/}
                {/*            </div>*/}

                {/*            /!* Right side: Category Details *!/*/}
                {/*            <div className="w-2/3 pl-6">*/}
                {/*                <div className="flex justify-between items-center mb-4">*/}
                {/*                    <h2 className="text-lg font-semibold">카테고리 설정</h2>*/}
                {/*                    <button*/}
                {/*                        onClick={() => setIsModalOpen(false)}*/}
                {/*                        className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"*/}
                {/*                    >*/}
                {/*                        취소*/}
                {/*                    </button>*/}
                {/*                    <button*/}
                {/*                        onClick={handleAddCategory}*/}
                {/*                        className="px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"*/}
                {/*                    >*/}
                {/*                        저장*/}
                {/*                    </button>*/}
                {/*                </div>*/}
                {/*                <input*/}
                {/*                    type="text"*/}
                {/*                    placeholder="카테고리명"*/}
                {/*                    value={newCategory.name}*/}
                {/*                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}*/}
                {/*                    className="mb-3 w-full p-2 border border-gray-300 rounded"*/}
                {/*                />*/}
                {/*                <textarea*/}
                {/*                    placeholder="설명"*/}
                {/*                    value={newCategory.description}*/}
                {/*                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}*/}
                {/*                    className="mb-3 w-full p-2 border border-gray-300 rounded"*/}
                {/*                />*/}
                {/*                <select*/}
                {/*                    className="mb-4 w-full p-2 border border-gray-300 rounded"*/}
                {/*                    value={parentCategoryId ?? ""}*/}
                {/*                    onChange={(e) => setParentCategoryId(e.target.value ? parseInt(e.target.value) : null)}*/}
                {/*                >*/}
                {/*                    <option value="">카테고리 제한</option>*/}
                {/*                    <option value="all">모든 사용자</option>*/}
                {/*                </select>*/}
                {/*                <p className="text-sm text-gray-500">*/}
                {/*                    디자인 모드의 쇼핑 위젯 설정에서 카테고리를 선택하면 해당 카테고리에 포함된 하위 카테고리는 자동 생성됩니다.*/}
                {/*                </p>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
                {/*{isModalOpen && (*/}
                {/*    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">*/}
                {/*        <div className="bg-white p-6 rounded-lg shadow-lg w-96">*/}
                {/*            <h2 className="text-lg font-semibold mb-4">카테고리 추가</h2>*/}
                {/*            <input*/}
                {/*                type="text"*/}
                {/*                placeholder="카테고리명"*/}
                {/*                value={newCategory.name}*/}
                {/*                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}*/}
                {/*                className="mb-3 w-full p-2 border border-gray-300 rounded"*/}
                {/*            />*/}
                {/*            <input*/}
                {/*                type="text"*/}
                {/*                placeholder="설명"*/}
                {/*                value={newCategory.description}*/}
                {/*                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}*/}
                {/*                className="mb-3 w-full p-2 border border-gray-300 rounded"*/}
                {/*            />*/}
                {/*            <select*/}
                {/*                className="mb-4 w-full p-2 border border-gray-300 rounded"*/}
                {/*                value={parentCategoryId ?? ""}*/}
                {/*                onChange={(e) => setParentCategoryId(e.target.value ? parseInt(e.target.value) : null)}*/}
                {/*            >*/}
                {/*                <option value="">최상위 카테고리로 추가</option>*/}
                {/*                {flattenCategories(categories).map((cat) => (*/}
                {/*                    <option key={cat.id} value={cat.id}>*/}
                {/*                        {cat.name}*/}
                {/*                    </option>*/}
                {/*                ))}*/}
                {/*            </select>*/}
                {/*            <div className="flex justify-end">*/}
                {/*                <button*/}
                {/*                    onClick={() => setIsModalOpen(false)}*/}
                {/*                    className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"*/}
                {/*                >*/}
                {/*                    취소*/}
                {/*                </button>*/}
                {/*                <button*/}
                {/*                    onClick={handleAddCategory}*/}
                {/*                    className="px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"*/}
                {/*                >*/}
                {/*                    추가*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}

                {/* 카테고리 테이블 */}
                <div
                    className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-meta-4 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">카테고리명</th>
                                <th scope="col" className="px-4 py-3">설명</th>
                                <th scope="col" className="px-4 py-3">서브 카테고리</th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderCategoryRows(filterCategories(categories))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    export default CategoryTable;
