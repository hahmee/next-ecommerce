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
            className={`cursor-pointer p-2 rounded ${
                isSelected
                    ? "bg-blue-400 text-white"
                    : "bg-white text-black hover:bg-blue-100"
            }`}

        >
            {category.cname}
        </li>
    );
};

export default CategoryItem;
