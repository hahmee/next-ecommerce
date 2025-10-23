import { create } from 'zustand';

import { ImageType } from '@/features/product/manage';

type State = {
  files: Array<ImageType>;
};

type Action = {
  setFiles: (files: Array<ImageType>) => void;
  clear: () => void;
};

export const useProductImageStore = create<State & Action>((set) => ({
  files: [],
  setFiles: (files) => {
    set({ files });
  },
  uploadFileNames: [],
  clear: () => {
    set({ files: [] });
  },
}));
