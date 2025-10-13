import { XMarkIcon } from '@heroicons/react/20/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Category } from '@/entities/category/model/types';
import {Params} from "@/entities/product/ui/ProductListView";


const FiltersBadge = ({ param, category }: { param: Params; category?: Category | undefined }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const deleteQueryString = () => {
    const params = new URLSearchParams(searchParams!.toString());
    // param이 ['color', 'green'] 형태일 때 'color'의 모든 값을 가져옴
    const values = params.getAll(param.key); // 'color' 파라미터의 모든 값을 가져옴

    // 'green' 값을 제외한 색상으로 새 배열 생성
    const newValues = values.filter((value) => value !== param.value);

    // 기존 'color' 키를 삭제
    params.delete(param.key);

    // 남은 색상 추가
    newValues.forEach((value) => params.append(param.key, value));

    // URL 업데이트
    router.replace(`/list?${params.toString()}`);
  };

  return (
    <div className="flex cursor-pointer items-center w-auto text-sm rounded-full font-semibold text-white bg-primary-950 py-1 px-4 text-center">
      {category ? <span>{category.cname}</span> : <span>{param?.value}</span>}

      <XMarkIcon
        className="ml-2 h-5 w-5 cursor-pointer text-gray-300"
        onClick={deleteQueryString}
      />
    </div>
  );
};
export default FiltersBadge;
