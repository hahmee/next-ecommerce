"use client";
import React, {useCallback, useEffect, useState} from "react";
import ImagePreview from "@/components/Admin/Product/ImagePreview";
import {useDropzone} from "react-dropzone";
import {useProductImageStore} from "@/store/productImageStore";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";


export interface ImageType {
    dataUrl: string;
    uploadKey?: string;
    file: File | undefined;
    id: number; //drag and drop
}


const ImageUploadForm = () => {
    const productImageStore = useProductImageStore();
    const uploadFileNames = productImageStore.uploadFileNames;
    const uploadFileKeys = productImageStore.uploadFileKeys;
    const [images, setImages] = useState<Array<ImageType>>([]);
    const [hoveredImg, setHoveredImg] = useState<string>('');
    const [imgIdxEnd, setImgIdxEnd] = useState<number>(0);

    const {getRootProps, getInputProps, open} = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles:10,
        // maxSize:2000000,
        onDrop: acceptedFiles => {
            setImages((prev) => {
                console.log('?');
                return prev.concat(acceptedFiles.map((file, index) => {
                        return Object.assign(file, {
                            dataUrl: URL.createObjectURL(file), file, id: imgIdxEnd + index

                        })
                    }
                ));
            });
        }
    });


    const deleteImage = useCallback((image: string) => {
        console.log('image', image);
        const index = images.findIndex(img => img?.dataUrl === image);

        const uploadFileNamesIdx = uploadFileNames.findIndex(files => files.file.file === image);

        //예전에 있었던 이미지라면, originalImageKeys, originalImageNames 에서도 지워줘야함
        if(images[index].file  === undefined) {
            const newFileNames = uploadFileNames.filter((names, index) => index !== uploadFileNamesIdx);
            const newFileKeys = uploadFileKeys.filter((names, index) => index !== uploadFileNamesIdx);

            console.log('newFileNames', newFileNames);
            // productImageStore.setUploadFileNames(newFileNames);
            // productImageStore.setUploadFileKeys(newFileKeys);
        }

        setImages((images) => {
            const prev = [...images] as Array<ImageType>;
            prev.splice(index, 1);
            return prev;
        });

    },[images]);


    const handleMouseOver= (image: string)=> {
        setHoveredImg(image);
    }

    const handleMouseOut= (image: string)=> {
        setHoveredImg('');
    }

    const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
        console.log('dragIndex', dragIndex); //
        console.log('hoverIndex', hoverIndex); // 놓을 거 (결과)

        //삭제 & 삽입
        setImages((prevImage) => {
            const drag = prevImage[dragIndex];
            prevImage.splice(dragIndex, 1); //없애기
            prevImage.splice(hoverIndex, 0, drag); // 놓을 곳에 하나 추가하기
            console.log('prevImage', prevImage);
            return prevImage;
        });



    }, [images]);

    useEffect(() => {
        console.log('????');
        console.log('images', images);
        setImgIdxEnd(images.length);
        productImageStore.setFiles(images); //files에 저장됨 ..

    },[images]);

    useEffect(() => {

        //수정 시
        console.log('uploadFileNames....', uploadFileNames);
        if (uploadFileNames && uploadFileNames.length > 0) {

            uploadFileNames.map((file,index) => {
                setImages((prev) => prev.concat({dataUrl: file.file.file, file: undefined, id:index, uploadKey: uploadFileKeys[index].file.file}))
            });


        }
        // 언마운트 시 url 무효화
        return () => {
            if(images && images.length > 0) {
                images.map(image => URL.revokeObjectURL(image?.dataUrl as string));
            }

            productImageStore.clear();
        };
    }, []);


    return (
        <div className="flex flex-col justify-center w-full gap-7">

            {/*<div className="grid grid-cols-auto-fill-100 gap-4">*/}
            {/*    <div className="w-58 h-58 col-span-2 row-span-2 flex rounded overflow-hidden">*/}
            {/*        <img src={imageList[0]} alt="Main Image" className="w-full h-full object-cover"/>*/}
            {/*    </div>*/}
            {/*    {*/}
            {/*        imageList.map((image, index) => {*/}
            {/*            return (*/}
            {/*                <div key={index} className="w-25 h-25 rounded overflow-hidden flex ">*/}
            {/*                    <img src={image} alt="Image 1" className="w-full h-full object-cover"/>*/}
            {/*                </div>*/}
            {/*            );*/}
            {/*        })*/}
            {/*    }*/}

            {/*</div>*/}


            <div className="grid grid-cols-auto-fill-100 gap-4">
                <DndProvider backend={HTML5Backend}>
                    {
                        images?.map((image, index) => (
                            <ImagePreview key={index}
                                          moveImage={moveImage}
                                          id={image.id}
                                          index={index}
                                          image={image?.dataUrl!}
                                          deleteImage={deleteImage}
                                          hoveredImg={hoveredImg}
                                          handleMouseOver={handleMouseOver}
                                          handleMouseOut={handleMouseOut}/>
                        ))
                    }

                </DndProvider>
            </div>


            <section>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <div
                        className="flex flex-col items-center justify-center w-full h-64 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="2"
                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                className="font-semibold">Click to upload</span> or
                                drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX.
                                800x400px)</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};
export default ImageUploadForm;