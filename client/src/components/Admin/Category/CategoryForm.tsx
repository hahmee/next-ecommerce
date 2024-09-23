import CategoryBreadcrumb from "@/components/Admin/CategoryBreadcrumb";
import React from "react";

interface Props {
    type: string;
    id?: string;
}

const CategoryForm = ({type, id}: Props) => {

    return (
        <form className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">

                <div className="col-span-2">
                    <CategoryBreadcrumb/>
                </div>

                <div className="col-span-2">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white">
                        카테고리명
                    </label>
                    <input
                        type="text"
                        id="pname"
                        name="pname"
                        placeholder="카테고리명을 입력해주세요."
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="col-span-2">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white">
                        카테고리설명
                    </label>
                    <textarea
                        id="pname"
                        name="pname"
                        placeholder="카테고리 설명을 입력해주세요."
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                {/*<div className="col-span-2">*/}
                {/*    <label className="mb-3 block text-sm font-medium text-black dark:text-white">*/}
                {/*        파일첨부*/}
                {/*    </label>*/}
                {/*    <input*/}
                {/*        type="file"*/}
                {/*        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div className="col-span-2">*/}
                {/*    <Select label={"사용여부"} options={useOptions}*/}
                {/*            defaultOption={"사용여부를 선택해주세요."}*/}
                {/*            originalData={undefined}*/}
                {/*            name="brand"/>*/}
                {/*</div>*/}
            </div>
            <button type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"></path>
                </svg>
                Add new product
            </button>
        </form>
    );
};
export default CategoryForm;
