"use client";

import Image from "next/image";
import {FormEvent, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // 입력값을 저장할 상태
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const queryValue = searchParams.get("query");

  useEffect(() => {
    setSearchQuery(queryValue || ""); // query 값이 변경될 때 searchQuery를 업데이트
  }, [queryValue]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    if (searchQuery.trim()) {      // 검색어가 있을 때만 검색 페이지로 이동
      params.delete("query");
      params.append("query", searchQuery.trim());
      router.push(`/list?${params.toString()}`);
    }
  };

  return (
    <form className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Search"
        value={searchQuery} // searchQuery 상태를 input의 value로 사용
        className="flex-1 bg-transparent outline-none"
        onChange={(e) => setSearchQuery(e.target.value)} // 입력값 업데이트
      />
      <button className="cursor-pointer" type="submit">
        <Image src="/search.png" alt="search" width={16} height={16} />
      </button>
    </form>
  );
};

export default SearchBar;
