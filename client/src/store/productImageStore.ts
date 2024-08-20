import {create} from "zustand";
import {ImageType} from "@/components/Admin/Product/ImageUploadForm";

interface imageState {
    files: Array<ImageType>;
    setFiles: (files: Array<ImageType>) => void;
}

export const useProductImageStore = create<imageState>((set) => ({
    files:[],
    setFiles: (files) => {
        set({files});
    }
}));