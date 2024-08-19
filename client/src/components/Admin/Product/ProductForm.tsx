import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ImageUploadForm from "@/components/Admin/Product/ImageUploadForm";
import Select from "@/components/Admin/Product/Select";

const brandOptions: string[] = [
    'ddd',
    'sss',
    'ggg'
];
const ProductForm:React.FC = () => {

    return (<>
        <div className="mx-auto">
            <Breadcrumb pageName="제품 등록"/>
            <div className="grid grid-cols-1 gap-9">
                <div className="flex flex-col gap-9">
                    <div
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                이미지 및 동영상
                            </h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-6">
                                <ImageUploadForm/>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-9">
                    <div
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                기본정보
                            </h3>
                        </div>
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        상품명 <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        판매상태<span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <Select label={"브랜드"} options ={brandOptions}/>
                                    {/*<label className="mb-3 block text-sm font-medium text-black dark:text-white">*/}
                                    {/*    브랜드 <span className="text-meta-1">*</span>*/}
                                    {/*</label>*/}
                                    {/*<input*/}
                                    {/*    type="email"*/}
                                    {/*    placeholder="Enter your email address"*/}
                                    {/*    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"*/}
                                    {/*/>*/}
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        카테고리 <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        판매 가격
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Select subject"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Select subject"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>


                            </div>
                        </form>
                    </div>
                </div>


                <div className="flex flex-col gap-9">
                    <div
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                상품 상세
                            </h3>
                        </div>
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        상품명 <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>


                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        상품 설명
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Type your message"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        환불 정보
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Type your message"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        반품 정보
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Type your message"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>


                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </>);
};

export default ProductForm;