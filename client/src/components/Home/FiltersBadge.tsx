import {XCircleIcon} from "@heroicons/react/20/solid";
import React from "react";
import {Category} from "@/interface/Category";
import {useRouter, useSearchParams} from "next/navigation";
import {Params} from "@/components/Home/ProductList";

const FiltersBadge = ({param, category}: { param: Params, category: Category | undefined }) => {

    // console.log('param', param);
    console.log('category', category);

    const router = useRouter();
    const searchParams = useSearchParams();

    const deleteQueryString = () => {

        const params = new URLSearchParams(searchParams); // 기존 쿼리스트링을 복사

        // param이 ['color', 'green'] 형태일 때 'color'의 모든 값을 가져옴
        const values = params.getAll(param.key); // 'color' 파라미터의 모든 값을 가져옴

        // 'green' 값을 제외한 색상으로 새 배열 생성
        const newValues = values.filter(value => value !== param.value);

        // 기존 'color' 키를 삭제
        params.delete(param.key);

        // 남은 색상 추가
        newValues.forEach(value => params.append(param.key, value));

        // URL 업데이트
        router.replace(`/list?${params.toString()}`);
    };

    if(category) {

        return <div className="flex cursor-pointer justify-between w-36 text-sm rounded-3xl ring-1 border-gray-500 text-gray-500 py-2 px-4 text-center">
            <span>{category.cname}</span>
            <XCircleIcon className="h-5 w-5 cursor-pointer" onClick={deleteQueryString}/>
        </div>
    }


    return <div className="flex cursor-pointer justify-between w-36 text-sm rounded-3xl ring-1 border-gray-500 text-gray-500 py-2 px-4 text-center">
        <span>{param.value}</span>
        <XCircleIcon className="h-5 w-5 cursor-pointer" onClick={deleteQueryString}/>
    </div>
};
export default FiltersBadge;