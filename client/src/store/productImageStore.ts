import {create} from "zustand";
import {ImageType} from "@/components/Admin/Product/ImageUploadForm";

type State = {
    files: Array<ImageType>;
    uploadFileNames: Array<string>; // 수정 시 원래 있었던 파일들 이름 값...
    uploadFileKeys: Array<string>; // 수정 시 원래 있었던 파일들 key값..
}

type Action = {
    setFiles: (files: Array<ImageType>) => void;
    setUploadFileNames: (files: Array<string>) => void;
    setUploadFileKeys: (files: Array<string>) => void;
    clear: () => void
}


// interface ImageState {
//     files: Array<ImageType>;
//     setFiles: (files: Array<ImageType>) => void;
//     uploadFileNames: Array<string>; // 수정 시 원래 있었던 파일들 이름 값...
//     setUploadFileNames: (files: Array<string>) => void;
//     uploadFileKeys: Array<string>; // 수정 시 원래 있었던 파일들 key값..
//     setUploadFileKeys: (files: Array<string>) => void;
// }

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
