import React, {Fragment, useState} from "react";
import {Category} from "@/interface/Category";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import {useRouter, useSearchParams} from "next/navigation";

type Props = {
    categories: Category[];
};

const ProductCategories: React.FC<Props> = ({categories}: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category_id") || "";

    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    // 행 클릭 시 확장 여부 토글
    const toggleRow = (id: number) => {

        setExpandedRows((prevExpandedRows) =>
            prevExpandedRows.includes(id)
                ? prevExpandedRows.filter((rowId) => rowId !== id)
                : [...prevExpandedRows, id]
        );
    };

    const onClickCategory = (categoryId:number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("category_id");
        params.append("category_id", categoryId.toString());

        router.push(`/list?${params.toString()}`);
    };


    // 재귀적으로 하위 카테고리를 렌더링하는 함수
    const renderCategoryRows = (categories: Category[], depth: number = 0) => {
        return categories.map((category) => (
            <Fragment key={category.cno}>
                <li className="flex items-center cursor-pointer justify-between"
                    style={{paddingLeft: `${depth * 20}px`}}
                    onClick={()=>onClickCategory(category.cno)}>
                    <div className={category.cno.toString() === categoryId ? "text-ecom font-bold" : ""}>{category.cname}</div>
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
            <h3 className="flex justify-between pb-6">
                <span className="font-medium text-gray-900">Category</span>
            </h3>
            <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                {categories && renderCategoryRows(categories)}
            </ul>
        </>
    );

};
export default ProductCategories;