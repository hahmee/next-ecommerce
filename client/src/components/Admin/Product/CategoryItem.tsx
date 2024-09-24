// components/Admin/Product/CategoryItem.js

import React from "react";
import { Category } from "@/interface/Category";

interface CategoryItemProps {
    category: Category;
    onClick: () => void;
    isSelected: boolean; // 선택된 카테고리 여부
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onClick, isSelected }) => {
    return (
        <li
            onClick={onClick}
            className={`p-2 cursor-pointer ${isSelected ? 'bg-blue-200' : 'hover:bg-gray-2'}`}
        >
            {category.cname}
        </li>
    );
};

export default CategoryItem;
