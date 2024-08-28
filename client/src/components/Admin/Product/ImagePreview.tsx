import React, {useEffect, useState} from "react";

interface Props {
    image: string;
    editImage: (image: string) => void;
    deleteImage: (image: string) => void;
    handleMouseOver: (image: string) => void;
    handleMouseOut: (image: string) => void;
    hoveredImg: string;
}
const ImagePreview = ({image, deleteImage, editImage, handleMouseOver,handleMouseOut,hoveredImg }: Props) => {

    return (
        <div onMouseOver={() => handleMouseOver(image)} onMouseOut={() => handleMouseOut(image)}>
            {
                hoveredImg === image && (
                    <div className="h-48 w-48 rounded-lg bg-black absolute bg-opacity-70">
                        <div className="absolute flex justify-end items-center w-48 gap-2 mt-2">
                            <div onClick={() => editImage(image)}>
                                <img src={"/edit.svg"} alt="close" className="h-4 w-4"/>
                            </div>
                            <div className="mr-2" onClick={() => deleteImage(image)}>
                                <img src={"/close.svg"} alt="close" className="h-4 w-4"/>
                            </div>
                        </div>
                    </div>
                )
            }

            <img
                src={image}
                alt="product"
                className="object-cover h-48 w-48  max-w-full rounded-lg"
            />
        </div>
    );
};

export default ImagePreview;
