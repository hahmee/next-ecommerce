"use client";
import React, {useCallback, useEffect, useState} from "react";
import ImagePreview from "@/components/Admin/Product/ImagePreview";
import {useDropzone} from "react-dropzone";
import {UseProductImageStore} from "@/store/productImageStore";


export interface ImageType {
    dataUrl: string;
    file: File | undefined;
}

const imageList = [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    "https://dummyimage.com/550x350/3399ff/000",
    "https://dummyimage.com/750x550/996633/fff",
    "https://dummyimage.com/950x750/cc9966/fff",
    "https://dummyimage.com/100x100/6699cc/000",
    "https://dummyimage.com/300x250/663366/fff",
    "https://dummyimage.com/850x650/339966/fff",
    "https://dummyimage.com/700x500/ff6600/fff",
    "https://dummyimage.com/900x700/663399/fff",
    "https://dummyimage.com/250x150/9966cc/fff",
    "https://dummyimage.com/450x350/00cccc/000",
];

const ImageUploadForm = () => {
    const productImageStore = UseProductImageStore();
    const uploadFileNames = productImageStore.uploadFileNames;
    const uploadFileKeys = productImageStore.uploadFileKeys;
    const [images, setImages] = useState<Array<ImageType>>([]);
    const [hoveredImg, setHoveredImg] = useState<string>('');

    const {getRootProps, getInputProps, open} = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles:10,
        // maxSize:2000000,
        onDrop: acceptedFiles => {
            setImages((prev) => {
                return prev.concat(acceptedFiles.map(file => Object.assign(file, {
                    dataUrl: URL.createObjectURL(file), file,

                })));
            });
        }
    });

    /*
    const handleImgChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        const targetFiles = (event.target as HTMLInputElement).files as FileList;
        const targetFilesArray = Array.from(targetFiles); //유사 배열 객체를 배열로 만듦
        console.log('targetFiles', targetFiles);
        console.log('targetFilesArray', targetFilesArray);


        const selectedFiles: Array<ImageType> = targetFilesArray.map((file, index) => {
            // files = [...files, file];
            return {dataUrl: URL.createObjectURL(file), file};
        });

        setImages((prev) => prev.concat(selectedFiles));

    };
    */

    const editImage = (image: string) => {
        //이미지 창이 다시 열린다.
    };

    const deleteImage = useCallback((image: string) => {
        const index = images.findIndex(img => img?.dataUrl === image);

        //예전에 있었던 이미지라면, originalImageKeys, originalImageNames 에서도 지워줘야함
        if(images[index].dataUrl === undefined) {

            const newFileNames = uploadFileNames.splice(index, 1);
            const newFileKeys = uploadFileKeys.splice(index, 1);

            productImageStore.setUploadFileNames(newFileNames);
            productImageStore.setUploadFileKeys(newFileKeys);

        }


        setImages((images) => {
            const prev = [...images] as Array<ImageType>;
            prev.splice(index, 1);
            return prev;
        });

    },[images]);


    const handleMouseOver= (image: string)=> {
        setHoveredImg(image)
    }

    const handleMouseOut= (image: string)=> {
        setHoveredImg('')

    }

    useEffect(() => {
        productImageStore.setFiles(images);

    },[images]);

    useEffect(() => {

        console.log('uploadFileNames....', uploadFileNames);
            if (uploadFileNames && uploadFileNames.length > 0) {

                uploadFileNames.map((file) => {
                    setImages((prev) => prev.concat({dataUrl: file, file: undefined}))
                });

            }
        // 언마운트 시 url 무효화
        return () => {
            if(images && images.length > 0) {
                images.map(image => URL.revokeObjectURL(image?.dataUrl as string));
            }
        };
    }, []);


    const onDragEnd =( ) => {

    }

    return (
        <div className="flex flex-col justify-center w-full gap-7">
            <div className="flex gap-4 flex-wrap">


                {
                    images?.map((image, index) => (
                        <ImagePreview key={index} index={index} image={image?.dataUrl!} deleteImage={deleteImage} editImage={editImage} hoveredImg={hoveredImg} handleMouseOver={handleMouseOver} handleMouseOut={handleMouseOut}/>
                    ))
                }

                {/*<DragDropContext onDragEnd={onDragEnd}>*/}
                {/*    <Droppable droppableId="droppable">*/}
                {/*        {(provided, snapshot) => (*/}
                {/*            <div*/}
                {/*                {...provided.droppableProps}*/}
                {/*                ref={provided.innerRef}*/}
                {/*            >*/}
                {/*                {imageList.map((item, index) => (*/}
                {/*                    <Draggable key={item} draggableId={item} index={index}>*/}
                {/*                        {(provided, snapshot) => (*/}
                {/*                            <div*/}
                {/*                                ref={provided.innerRef}*/}
                {/*                                {...provided.draggableProps}*/}
                {/*                                {...provided.dragHandleProps}*/}
                {/*                            >*/}
                {/*                                <img src={item}/>*/}
                {/*                            </div>*/}
                {/*                        )}*/}
                {/*                    </Draggable>*/}
                {/*                ))}*/}
                {/*                {provided.placeholder}*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </Droppable>*/}
                {/*</DragDropContext>*/}


                {/*{*/}
                {/*    imageList.map((image, index) => (*/}
                {/*        <ImagePreview key={index} index={index} image={image} deleteImage={deleteImage}*/}
                {/*                      editImage={editImage} hoveredImg={hoveredImg}*/}
                {/*                      handleMouseOver={handleMouseOver} handleMouseOut={handleMouseOut}/>*/}
                {/*    ))*/}
                {/*}*/}


            </div>

            <section>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <div
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
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