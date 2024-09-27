import React, {Fragment, useState} from "react";
import {FilterOption, FilterSection, SubCategory} from "@/components/Home/ProductList";
import {Category} from "@/interface/Category";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import {useRouter} from "next/navigation";

type Props = {
    filters: FilterSection[];
    categories: Category[];
};

const ProductFilters: React.FC<Props> = ({filters, categories}: Props) => {

    const router = useRouter();

    const [filterStates, setFilterStates] = useState<Record<string, FilterOption[]>>({
        color: filters[0].options,
        category: filters[1].options,
        size: filters[2].options,
    });
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleFilter = (sectionId: string, value?: string) => {
        if (value) {
            setFilterStates((prev) => ({
                ...prev,
                [sectionId]: prev[sectionId].map(option =>
                    option.value === value ? {...option, checked: !option.checked} : option
                ),
            }));
        }
    };

    // 행 클릭 시 확장 여부 토글
    const toggleRow = (id: number) => {

        setExpandedRows((prevExpandedRows) =>
            prevExpandedRows.includes(id)
                ? prevExpandedRows.filter((rowId) => rowId !== id)
                : [...prevExpandedRows, id]
        );
    };

    // 재귀적으로 하위 카테고리를 렌더링하는 함수
    const renderCategoryRows = (categories: Category[], depth: number = 0) => {
        return categories.map((category) => (
            <Fragment key={category.cno}>
                <li className="flex items-center cursor-pointer justify-between"
                    style={{paddingLeft: `${depth * 20}px`}}
                    onClick={() => router.push(`/list?categoryId=${category.cno}`)}>
                    <div>{category.cname}</div>
                    {category.subCategories && (
                        <div onClick={(e) => {
                            e.stopPropagation(); // 부모 onClick 이벤트 방지
                            toggleRow(category.cno); // toggleRow 함수 호출
                        }}>
                            {expandedRows.includes(category.cno) ? (
                                <ChevronUpIcon className="h-5 w-5"/>
                            ) : (
                                <ChevronDownIcon className="h-5 w-5"/>
                            )}
                        </div>
                    )}
                </li>
                {expandedRows.includes(category.cno) && category.subCategories && (
                    renderCategoryRows(category.subCategories, depth + 1)
                )}
            </Fragment>
        ));
    };

    return (
        <form className="hidden lg:block">
            <h3 className="sr-only">Categories</h3>
            <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                {categories && renderCategoryRows(categories)}
            </ul>

            {filters.map((section) => (
                <div key={section.id} className="border-b border-gray-200 py-6">
                    <h3 className="flex justify-between">
                        <span className="font-medium text-gray-900">{section.name}</span>
                    </h3>
                    <div className="space-y-4 pt-6">
                        {section.options.map((option) => (
                            <div key={option.value} className="flex items-center">
                                <input
                                    checked={filterStates[section.id].find(o => o.value === option.value)?.checked}
                                    id={`filter-${section.id}-${option.value}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={() => toggleFilter(section.id, option.value)}
                                />
                                <label
                                    htmlFor={`filter-${section.id}-${option.value}`}
                                    className="ml-3 text-gray-500"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </form>
    );

};
export default ProductFilters;