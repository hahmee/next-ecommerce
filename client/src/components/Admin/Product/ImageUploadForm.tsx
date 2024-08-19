"use client";
import React, {ChangeEventHandler, useCallback, useEffect, useState} from "react";
import ImagePreview from "@/components/Admin/Product/ImagePreview";
import {useProductImageStore} from "@/store/productImageStore";

const ImageUploadForm: React.FC = () => {

    const [images, setImages] = useState<Array<{ dataUrl: string, file: File } | null>>([]);

    const productImageStore = useProductImageStore();

    const handleImgChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        const targetFiles = (event.target as HTMLInputElement).files as FileList;
        const targetFilesArray = Array.from(targetFiles); //유사 배열 객체를 배열로 만듦
        console.log('targetFiles', targetFiles);
        console.log('targetFilesArray', targetFilesArray);

        const selectedFiles = targetFilesArray.map((file, index) => {
            return {dataUrl: URL.createObjectURL(file), file};
        });

        setImages((prev) => prev.concat(selectedFiles));

    };

    const editImage = (image: string) => {

        //이미지 창이 다시 열린다.
    };

    const deleteImage = useCallback((image: string) => {

        console.log('image', image);
        const index = images.findIndex(img => img?.dataUrl === image);
        setImages((images) => {
            const prev = [...images];
            prev.splice(index, 1);
            return prev;
        });

    },[images]);

    useEffect(() => {
        // 언마운트 시 url 무효화
        return () => {
            if(images && images.length > 0) {
                images.map(image => URL.revokeObjectURL(image?.dataUrl as string));
            }
        };
    }, []);

    return (<div className="flex flex-col justify-center w-full gap-7">

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {
                    images?.map((image, index) => (
                        <ImagePreview key={index} image={image?.dataUrl!} deleteImage={deleteImage} editImage={editImage}/>
                    ))
                }

            </div>


            <label htmlFor="dropzone-file"
                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or
                        drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF
                        (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" multiple={true} onChange={handleImgChange}/>
            </label>
        </div>
    );
};
export default ImageUploadForm;