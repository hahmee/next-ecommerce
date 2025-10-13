
import React from 'react';

import { Category } from '@/entities/category/model/types';

interface CategoryItemProps {
  category: Category;
  onClick: () => void;
  isSelected: boolean; // 선택된 카테고리 여부
  level: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onClick, isSelected, level }) => {
  return (
    <li
      onClick={onClick}
      className={`cursor-pointer p-2 rounded m-1.5 ${
        isSelected ? 'bg-blue-400 text-white' : 'text-black hover:bg-blue-100'
      }`}
      data-testid="category"
      data-level={level}
    >
      {category.cname}
    </li>
  );
};

export default CategoryItem;
