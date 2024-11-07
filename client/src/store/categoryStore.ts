import {create} from "zustand";
import {fetchJWT} from "@/utils/fetchJWT";
import {Category} from "@/interface/Category";

type CategoryState = {
  categories:Category[];
  isLoading: boolean;
  getCategories: () => void;
  setCategories: (categories:Category[]) => void;
  clear: () => void;
};


export const useCategoryStore = create<CategoryState>((set) => ({
      categories: [],
      isLoading: true,
      getCategories: async () => {
        try {
          const categories = await fetchJWT(`/api/category/list`, {
            method: "GET",
            credentials: 'include',
          });

          set({
            categories: categories.data || [],
            isLoading: false,
          });

        } catch (err) {
          set((prev) => ({...prev, isLoading: false}));
        }
      },
      setCategories: (categories) => {
          set({categories});
      },
      clear: () => {
        set({categories: []});
      }
    }
));
