import { create } from 'zustand';
import { ColorTag } from '@/interface/ColorTag';

interface TagStore {
  tags: ColorTag[];
  addTag: (tag: ColorTag) => void;
  removeTag: (index: number) => void;
  setTagColor: (index: number, color: string) => void;
  clear: () => void;
}

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (index) =>
    set((state) => ({
      tags: state.tags.filter((_, i) => i !== index),
    })),
  setTagColor: (index, color) =>
    set((state) => {
      const updatedTags = [...state.tags];
      updatedTags[index].color = color;
      return { tags: updatedTags };
    }),
  clear: () => {
    set({ tags: [] });
  },
}));
