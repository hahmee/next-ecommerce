import {Category} from "@/components/Tables/CategoryTable";

interface BreadcrumbProps {
    clickedCt: Category;
    categories: Category[];
    newCategory: { name: string, description:string };

}

const CategoryBreadcrumb = ({clickedCt, categories, newCategory}: BreadcrumbProps) => {

    // 카테고리를 평탄화하여 자식 부모 카테고리가 있을 시 찾기
    const flattenCategories = (categories: Category[], depth: number = 0, prefix: string = ""): {
        id: number;
        name: string,
        category: Category
    }[] => {
        return categories.reduce<{ id: number; name: string; category: Category }[]>((acc, category) => {
            acc.push({id: category.id, name: `${prefix}${category.name}`, category});

            if (category.subCategories && category.subCategories.length > 0) {
                acc = acc.concat(flattenCategories(category.subCategories, depth + 1, `${prefix} -- `));
            }
            return acc;
        }, []);
    };
    //부모 모두 찾기..

// 재귀적으로 부모를 추적하는 함수
    function findParents(categories: Category[], targetId: number, path: Category[] = []): Category[] | null {
        for (const category of categories) {
            // 현재 카테고리를 path에 추가
            const newPath = [...path, category];

            // 타겟 ID와 일치하면 부모 경로를 반환
            if (category.id === targetId) {
                return newPath;
            }

            // 서브카테고리가 있는 경우 재귀적으로 탐색
            if (category.subCategories) {
                const result = findParents(category.subCategories, targetId, newPath);
                if (result) {
                    return result; // 타겟을 찾으면 즉시 결과 반환
                }
            }
        }

        // 타겟을 찾지 못한 경우 null 반환
        return null;
    }

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <nav>
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    {
                        findParents(categories, clickedCt?.id)?.map((category: Category, idx: number) => (
                            <li className="inline-flex items-center" key={category.id}>
                                <div
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    {
                                        idx === 0 ?
                                            <svg className="w-3 h-3 me-2.5" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                            </svg>
                                            :
                                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                                 aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                <path stroke="currentColor" strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="m1 9 4-4-4-4"/>
                                            </svg>

                                    }
                                    {category.name}

                                </div>
                            </li>
                        ))
                    }

                    {
                        newCategory.name &&
                        <li className="inline-flex items-center">
                            <div
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                     aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="m1 9 4-4-4-4"/>
                                </svg>
                                {
                                    newCategory.name
                                }
                            </div>
                        </li>
                    }

                </ol>
            </nav>
        </div>
    );
};

export default CategoryBreadcrumb;
