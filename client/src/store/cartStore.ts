import { create } from "zustand";
import {CartItemList} from "@/interface/CartItemList";
import {CartItem} from "@/interface/CartItem";
import {fetchWithAuth} from "@/utils/fetchWithAuth";

type CartState = {
  cart:CartItemList[];
  isLoading: boolean;
  counter: number;
  getCart: () => void;
  changeCart: (cartItem: CartItem) => void;
  removeItem: (cino: number) => void;
  open:boolean,
  changeOpen: (isOpen:boolean) => void
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isLoading: true,
  counter: 0,
  open:false,
  changeOpen: (isOpen:boolean) => {
    set({open: isOpen})
  },
  getCart: async () => {
    try {
      const cart = await fetchWithAuth(`/api/cart/items`, {
        method: "GET",
        credentials: 'include',
      });

      set({
        cart: cart.data || [],
        isLoading: false,
        counter: cart.data.length || 0,
      });

    }catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  changeCart: async (cartItem) => {
    set((state) => ({ ...state, isLoading: true }));

    const cart = await fetchWithAuth(`/api/cart/change`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartItem),
    })

    set({
      cart: cart.data || [],
      isLoading: false,
      counter: cart.data.length || 0,
    });

  },

  removeItem: async (cino) => {
    set((state) => ({ ...state, isLoading: true }));

    const response = await fetchWithAuth(`/api/cart/${cino}`, {
      method: "DELETE",
      credentials: 'include',
    })

    set({
      cart: response.data || [],
      isLoading: false,
      counter: response.data.length || 0,
    });
  },

}));
