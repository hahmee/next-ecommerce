import {create} from "zustand";
import {ImageType} from "@/components/Admin/Product/ImageUploadForm";

export interface UploadFile {
    id: number; //순서
    file: string; // 파일이름 or 파일 키
}

type State = {
    files: Array<ImageType>;
    uploadFileNames: Array<UploadFile>; // 수정 시 원래 있었던 파일들 이름 값...
    uploadFileKeys: Array<UploadFile>; // 수정 시 원래 있었던 파일들 key값..
}

type Action = {
    setFiles: (files: Array<ImageType>) => void;
    setUploadFileNames: (files: Array<UploadFile>) => void;
    setUploadFileKeys: (files: Array<UploadFile>) => void;
    clear: () => void
}

export const useProductImageStore = create<State & Action>((set) => ({
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
    },
    clear: ()=>{
        set({uploadFileKeys: [], uploadFileNames: [], files:[]});
    }

}));
