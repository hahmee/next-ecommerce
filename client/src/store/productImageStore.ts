import {create} from "zustand";

interface imageState {
    files: Array<File>;
    setFiles: (files: Array<File>) => void;
}

export const useProductImageStore = create<imageState>((set) => ({
    files:[],
    setFiles: (files) => {
        set({files});
    }

}));