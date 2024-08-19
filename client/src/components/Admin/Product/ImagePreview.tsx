import Image from "next/image";
import React from "react";

const ImagePreview = ({image, deleteImage, editImage}: { image: string, editImage: (image:string) => void, deleteImage: (image:string) => void}) => {
    return (
        <div>
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
            <img
                src={image}
                alt="product"
                className="object-cover h-48 w-48  max-w-full rounded-lg"
                width={300}
                height={340}
            />
        </div>
    );
};

export default ImagePreview;
