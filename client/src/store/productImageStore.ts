import {create} from "zustand";
import {ImageType} from "@/components/Admin/Product/ImageUploadForm";

interface ImageState {
    files: Array<ImageType>;
    setFiles: (files: Array<ImageType>) => void;
    uploadFileNames: Array<string>; // 수정 시 원래 있었던 파일들 이름 값...
    setUploadFileNames: (files: Array<string>) => void;
    uploadFileKeys: Array<string>; // 수정 시 원래 있었던 파일들 key값..
    setUploadFileKeys: (files: Array<string>) => void;

}

export const useProductImageStore = create<ImageState>((set) => ({
    files:[],
    setFiles: (files) => {
        set({files});
    },
    uploadFileNames: [],
    setUploadFileNames: (names) => {
        set({uploadFileNames: names});
    },
    uploadFileKeys: [],
    setUploadFileKeys: (keys) => {
        set({uploadFileKeys: keys});
    }

}));
