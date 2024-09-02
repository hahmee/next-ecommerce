import React, {useEffect, useState} from "react";

interface Props {
    image: string;
    editImage: (image: string) => void;
    deleteImage: (image: string) => void;
    handleMouseOver: (image: string) => void;
    handleMouseOut: (image: string) => void;
    hoveredImg: string;
    index: number;
}

const ImagePreview = ({image, deleteImage, editImage, handleMouseOver, handleMouseOut, hoveredImg, index}: Props) => {


    const hoverActionComponent = () => {
        return (
            <div className="flex justify-end items-center w-48 gap-2 mt-2">
                <div onClick={() => editImage(image)}>
                    <img src={"/edit.svg"} alt="close" className="h-4 w-4"/>
                </div>
                <div className="mr-2" onClick={() => deleteImage(image)}>
                    <img src={"/close.svg"} alt="close" className="h-4 w-4"/>
                </div>
                <div className="top-50 left-50">
                    <img src={"/dragable.svg"} alt="close" className="h-4 w-4"/>
                </div>
                {
                    index === 0 &&
                    <div className="top-50 left-50">
                        커버 이미지
                    </div>
                }
            </div>
        );
    }

    return (
        <>


            {/*{*/}
            {/*    (hoveredImg === image && index !== 0) && (*/}
            {/*        <div className="w-25 h-25 rounded bg-black absolute bg-opacity-70" onMouseOver={() => handleMouseOver(image)} onMouseOut={() => handleMouseOut(image)}>*/}
            {/*            <div className="absolute">*/}
            {/*                asdfasdf*/}
            {/*                /!*<div className="flex justify-end items-center w-48 gap-2 mt-2">*!/*/}
            {/*                /!*    <div onClick={() => editImage(image)}>*!/*/}
            {/*                /!*        <img src={"/edit.svg"} alt="close" className="h-4 w-4"/>*!/*/}
            {/*                /!*    </div>*!/*/}
            {/*                /!*    <div className="mr-2" onClick={() => deleteImage(image)}>*!/*/}
            {/*                /!*        <img src={"/close.svg"} alt="close" className="h-4 w-4"/>*!/*/}
            {/*                /!*    </div>*!/*/}
            {/*                /!*    <div className="top-50 left-50">*!/*/}
            {/*                /!*        <img src={"/dragable.svg"} alt="close" className="h-4 w-4"/>*!/*/}
            {/*                /!*    </div>*!/*/}
            {/*                /!*    {*!/*/}
            {/*                /!*        index === 0 &&*!/*/}
            {/*                /!*        <div className="top-50 left-50">*!/*/}
            {/*                /!*            커버 이미지*!/*/}
            {/*                /!*        </div>*!/*/}
            {/*                /!*    }*!/*/}
            {/*                /!*</div>*!/*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}


            {
                index === 0 ?
                    <div className="col-span-2 row-span-2 h-52 w-52 flex rounded overflow-hidden"
                         onMouseOver={() => handleMouseOver(image)} onMouseOut={() => handleMouseOut(image)}>
                        {
                            hoveredImg === image && <div className="h-52 w-52 rounded bg-black absolute bg-opacity-70">
                                {
                                    hoverActionComponent()
                                }
                            </div>
                        }
                        <img src={image} alt="Main_Image" className="w-full h-full object-cover"/>
                    </div>
                    :
                    <div key={index} className="w-25 h-25 rounded overflow-hidden flex" onMouseOver={() => handleMouseOver(image)} onMouseOut={() => handleMouseOut(image)}>
                        {
                            hoveredImg === image &&
                            <div className="h-25 w-25 rounded bg-black absolute bg-opacity-70">
                                {
                                    hoverActionComponent()
                                }
                            </div>
                        }
                        <img src={image} alt="Sub_image" className="w-full h-full object-cover"/>
                    </div>
            }


        </>
    );
};

export default ImagePreview;


