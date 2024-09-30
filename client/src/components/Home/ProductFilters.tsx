import React, {Fragment, useEffect, useState} from "react";
import {FilterOption, FilterSection} from "@/components/Home/ProductList";
import {Category} from "@/interface/Category";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import {useRouter, useSearchParams} from "next/navigation";

type Props = {
    filters: FilterSection[];
};

const ProductFilters: React.FC<Props> = ({filters}: Props) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [filterStates, setFilterStates] = useState<Record<string, FilterOption[]>>({
        color: filters[0].options,
        category: filters[1].options,
        size: filters[2].options,
    });

    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    useEffect(() => {
        // 쿼리 문자열에서 필터 값을 가져와서 필터 상태를 업데이트
        const newFilterStates = { ...filterStates };

        filters.forEach(section => {
            const currentFilters = searchParams.getAll(section.id);
            newFilterStates[section.id] = section.options.map(option => ({
                ...option,
                checked: currentFilters.includes(option.value),
            }));
        });

        setFilterStates(newFilterStates);
    }, [searchParams, filters]);

    const toggleFilter = (sectionId: string, value?: string) => {
        if (value) {
            const params = new URLSearchParams(searchParams.toString());

            // console.log('params...', params);
            // 현재 필터가 적용되어 있는지 확인
            const currentFilters = params.getAll(sectionId);

            if (currentFilters.includes(value)) {
                // 필터가 이미 적용되어 있으면 제거
                params.delete(sectionId);
                currentFilters.filter((filter) => filter !== value).forEach((filter) => params.append(sectionId, filter));
            } else {
                // 필터가 적용되어 있지 않으면 추가
                params.append(sectionId, value);
            }

            // console.log('params...toString()', params.toString());

            // 새 쿼리스트링으로 URL 업데이트
            router.push(`/list?${params.toString()}`);
        }
    };

    const toggleFilter2 = (sectionId: string, value?: string) => {
        // if (value) {
        //     setFilterStates((prev) => ({
        //         ...prev,
        //         [sectionId]: prev[sectionId].map(option =>
        //             option.value === value ? {...option, checked: !option.checked} : option
        //         ),
        //     }));
        // }

        if (value) {
            const params = new URLSearchParams(searchParams.toString());

            // console.log('params....입니다....',params)
            // Check if the filter is already in the query params
            const currentFilters = params.get(sectionId)?.split(",") || [];

            // console.log('currentFilters...', currentFilters);
            if (currentFilters.includes(value)) {
                // Remove the filter if it's already applied
                const updatedFilters = currentFilters.filter((filter) => filter !== value);
                if (updatedFilters.length > 0) {
                    params.set(sectionId, updatedFilters.join(","));
                } else {
                    params.delete(sectionId);
                }
            } else {
                // Add the filter if it's not applied
                currentFilters.push(value);
                params.set(sectionId, currentFilters.join(","));
            }

            // Update the URL with the new query string
            router.push(`/list?${params.toString()}`);
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
                    onClick={() => router.push(`/list?category_id=${category.cno}`)}>
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
        <>
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
        </>
    );

};
export default ProductFilters;