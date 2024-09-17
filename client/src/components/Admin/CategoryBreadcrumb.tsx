import {Category} from "@/components/Tables/CategoryTable";
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;
import {categoryOptions} from "@/components/Admin/Product/ProductForm";

interface BreadcrumbProps {
    pageName: string;
    clickedCt: Category;
    categories: Category[];
}

const CategoryBreadcrumb = ({pageName, clickedCt, categories}: BreadcrumbProps) => {

    console.log('click', clickedCt)

    // 카테고리를 평탄화하여 자식 부모 카테고리가 있을 시 찾기
    const flattenCategories = (categories: Category[], depth: number = 0, prefix: string = ""): { id: number; name: string, category: Category }[] => {
        return categories.reduce<{ id: number; name: string; category:Category }[]>((acc, category) => {
            acc.push({ id: category.id, name: `${prefix}${category.name}`, category });

            if (category.subCategories && category.subCategories.length > 0) {
                acc = acc.concat(flattenCategories(category.subCategories, depth + 1, `${prefix} -- `));
            }
            return acc;
        }, []);
    };

    //부모 모두 찾기..
    const findAncestors = (categories: Category[], clickedCt: Category) => {

        //클릭한 아이디
        const targetId = clickedCt.id;

        for(const category of categories) {
            const newPath = [] as any;

            if(category.id === targetId) { // 아이디가 같다면
                return newPath.concat(category.name);
            }

            if(category.subCategories && category.subCategories.length > 0) { //서브 카테고리가 있는 경우 재귀적 탐색
                const result = findAncestors(category.subCategories, category);
                console.log(result);

            }
        }
    }

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <nav>
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    {findAncestors(categories, clickedCt) as any}
                    {/*<li className="inline-flex items-center">*/}
                    {/*    <a href="#"*/}
                    {/*       className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">*/}
                    {/*        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
                    {/*             fill="currentColor" viewBox="0 0 20 20">*/}
                    {/*            <path*/}
                    {/*                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>*/}
                    {/*        </svg>*/}
                    {/*        Home*/}
                    {/*    </a>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <div className="flex items-center">*/}
                    {/*        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"*/}
                    {/*             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">*/}
                    {/*            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"*/}
                    {/*                  stroke-width="2"*/}
                    {/*                  d="m1 9 4-4-4-4"/>*/}
                    {/*        </svg>*/}
                    {/*        <a href="#"*/}
                    {/*           className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Projects</a>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                    {/*<li aria-current="page">*/}
                    {/*    <div className="flex items-center">*/}
                    {/*        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"*/}
                    {/*             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">*/}
                    {/*            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"*/}
                    {/*                  d="m1 9 4-4-4-4"/>*/}
                    {/*        </svg>*/}
                    {/*        <span*/}
                    {/*            className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Flowbite</span>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                </ol>
            </nav>
        </div>
    );
};

export default CategoryBreadcrumb;
