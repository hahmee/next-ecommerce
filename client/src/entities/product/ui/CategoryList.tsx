// src/entities/product/ui/CategoryList.tsx

﻿// src/entities/product/ui/CategoryList.tsx

import React from 'react';

import { Category } from '@/entities/category/model/types';
import CategoryItem from '@/entities/product/ui/CategoryItem';

interface CategoryListProps {
  categories: Category[];
  level: number;
  onSelect: (category: Category) => void;
  selectedCategories: Category[]; // 선택된 모든 카테고리 배열
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  level,
  onSelect,
  selectedCategories,
}) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="w-64 shadow-md bg-gray-2 p-2 m-2.5 rounded min-w-64 bg-gray-50 dark:bg-gray-300">
      <ul>
        {categories.map((category) => (
          <CategoryItem
            key={category.cno}
            category={category}
            onClick={() => onSelect(category)}
            level={level}
            isSelected={selectedCategories.some((selected) => selected.cno === category.cno)} // 선택된 카테고리와 비교하여 상태 전달
          />
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
