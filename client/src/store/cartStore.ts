import {create} from "zustand";
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
  subtotal:number,
  changeOpen: (isOpen:boolean) => void
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isLoading: true,
  counter: 0,
  open: false,
  subtotal: 0,
  changeOpen: (isOpen:boolean) => {
    set({open: isOpen})
  },

  getCart: async () => {
    try {
      const cart = await fetchWithAuth(`/api/cart/items`, {
        method: "GET",
        credentials: 'include',
      });

      const cartItems = cart.data || [];

      const subtotal = cartItems.length > 0 ? cartItems.reduce((total:number, item:CartItemList) => total + item.price * item.qty, 0) : 0;

      console.log('subtotal', subtotal);

      set({
        cart: cartItems,
        isLoading: false,
        counter: cartItems.length,
        subtotal

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
    });

    const cartItems = cart.data || [];

    const subtotal = cartItems.length > 0 ? cartItems.reduce((total:number, item:CartItemList) => total + item.price * item.qty, 0) : 0;

    set({
      cart: cartItems,
      isLoading: false,
      counter: cartItems.length,
      // subtotal: cart.data.price * cart.data.qty,
      subtotal
    });

  },

  removeItem: async (cino) => {
    set((state) => ({ ...state, isLoading: true }));

    const cart = await fetchWithAuth(`/api/cart/${cino}`, {
      method: "DELETE",
      credentials: 'include',
    })

    const cartItems = cart.data || [];


    const subtotal = cartItems.length > 0 ? cartItems.reduce((total:number, item:CartItemList) => total + item.price * item.qty, 0) : 0;


    set({
      cart: cartItems,
      isLoading: false,
      counter: cartItems.length,
      subtotal
    });
  },



}));
