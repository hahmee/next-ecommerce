import React from "react";
import { Category } from "@/interface/Category";
import CategoryItem from "@/components/Admin/Product/CategoryItem";

interface CategoryListProps {
    categories: Category[];
    level: number;
    onSelect: (category: Category) => void;
    selectedCategories: Category[]; // 선택된 모든 카테고리 배열
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, level, onSelect, selectedCategories }) => {
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="w-64 border shadow-md bg-gray-100">
            <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                    <CategoryItem
                        key={category.cno}
                        category={category}
                        onClick={() => onSelect(category)}
                        isSelected={selectedCategories.some(selected => selected.cno === category.cno)} // 선택된 카테고리와 비교하여 상태 전달
                    />
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
