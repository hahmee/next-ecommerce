import { Category } from "@/interface/Category";
import { useState } from "react";
import CategoryList from "@/components/Admin/Product/CategoryList";

const CategorySelect = ({ categories }: { categories: Category[] | [] }) => {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    const handleCategorySelect = (category: Category, level: number) => {
        const updatedCategories = [...selectedCategories];
        updatedCategories[level] = category;
        setSelectedCategories(updatedCategories.slice(0, level + 1));
    };

    return (
        <div className="overflow-x-auto w-full">
            <div className="flex space-x-4">
                <CategoryList
                    categories={categories}
                    level={0}
                    onSelect={(category) => handleCategorySelect(category, 0)}
                    selectedCategories={selectedCategories} // 모든 선택된 카테고리 전달
                />

                {selectedCategories.map((cat, index) => (
                    <CategoryList
                        key={index}
                        categories={cat.subCategories || []}
                        level={index + 1}
                        onSelect={(category) => handleCategorySelect(category, index + 1)}
                        selectedCategories={selectedCategories} // 모든 선택된 카테고리 전달
                    />
                ))}
            </div>
        </div>
    );
};

export default CategorySelect;
