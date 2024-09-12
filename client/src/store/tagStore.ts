import create from 'zustand';
import {ColorTag} from "@/interface/ColorTag";

interface TagStore {
    tags: ColorTag[];
    addTag: (tag: ColorTag) => void;
    removeTag: (index: number) => void;
    setTagColor: (index: number, color: string) => void;
}

export const useTagStore = create<TagStore>((set) => ({
    tags: [],
    addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
    removeTag: (index) => set((state) => ({
        tags: state.tags.filter((_, i) => i !== index)
    })),
    setTagColor: (index, color) => set((state) => {
        const updatedTags = [...state.tags];
        // if(updatedTags && updatedTags.length > 0) {
        updatedTags[index].color = color;
        console.log('updatedTags', updatedTags);
        // }
        return {tags: updatedTags};
    }),
}));
