import {create} from "zustand";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {Category} from "@/interface/Category";

type CategoryState = {
  categories:Category[];
  isLoading: boolean;
  getCategories: () => void;
  setCategories: (categories:Category[]) => void;
  clear: () => void;
  // changeCart: (cartItem: CartItem) => void;
  // removeItem: (cino: number) => void;
};


export const useCategoryStore = create<CategoryState>((set) => ({
      categories: [],
      isLoading: true,
      getCategories: async () => {
        try {
          const categories = await fetchWithAuth(`/api/category/`, {
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
          console.log('categories', categories);
      },
      clear: () => {
        set({categories: []});
      }
    }
));
