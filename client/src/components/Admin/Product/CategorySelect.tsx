import { Category } from "@/interface/Category";
import {useEffect, useState} from "react";
import CategoryList from "@/components/Admin/Product/CategoryList";

const CategorySelect = ({categories, setSelectedCategory, categoryPaths}: { categories: Category[] | [], setSelectedCategory:(category: Category | null) => void, categoryPaths:Category[] | []  } ) => {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (categoryPaths && categoryPaths.length > 0) {
            setSelectedCategories(categoryPaths);
        }
    }, [categoryPaths]);

    const handleCategorySelect = (category: Category, level: number) => {
        const updatedCategories = [...selectedCategories];
        updatedCategories[level] = category;
        setSelectedCategories(updatedCategories.slice(0, level + 1));

        //부모에게 보내줄 최하위 카테고리
        if (category.subCategories === null) {
            setSelectedCategory(category);
        }else{
            setSelectedCategory(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-nowrap overflow-x-auto">
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
