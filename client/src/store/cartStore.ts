import {create} from "zustand";
import {CartItemList} from "@/interface/CartItemList";
import {CartItem} from "@/interface/CartItem";
import {fetchJWT} from "@/utils/fetchJWT";

type CartState = {
  carts: CartItemList[];
  isLoading: boolean;
  counter: number;
  changeCart: (cartItem: CartItem) => void;
  removeItem: (cino: number) => void;
  open: boolean,
  subtotal: number,
  changeOpen: (isOpen: boolean) => void,
  shippingFee: number,
  tax: number,
  total: number,
  setCarts: (cartItems:CartItemList[]) => void
};

export const useCartStore = create<CartState>((set,get) => ({
  carts: [],
  isLoading: true,
  counter: 0,
  open: false,
  subtotal: 0,
  shippingFee:0,
  tax:0,
  total:0,
  setCarts: (cartItems) => {

    const subtotal = cartItems.length > 0 ? cartItems.reduce((total: number, item: CartItemList) => total + item.price * item.qty, 0) : 0;

    const shippingFee = subtotal > 100000 ? 0 : 3500;

    const tax = Math.round((subtotal + shippingFee) * 0.05);

    const total = subtotal + shippingFee + tax;

    set({
      carts: cartItems,
      isLoading: false,
      counter: cartItems.length,
      subtotal,
      shippingFee,
      tax,
      total
    });
  },
  changeOpen: (isOpen:boolean) => {
    set({open: isOpen})
  },
  changeCart: async (cartItem) => {
    set((state) => ({ ...state, isLoading: true }));

    const cart = await fetchJWT<CartItemList[]>(`/api/cart/change`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartItem),
    });

    if (!cart.success) {
      console.error("장바구니 변경 실패:", cart.message);
      return;
    }

    const items = Array.isArray(cart.data) ? cart.data : [];
    get().setCarts(items);

  },

  removeItem: async (cino) => {
    set((state) => ({ ...state, isLoading: true }));

    const cart = await fetchJWT(`/api/cart/${cino}`, {
      method: "DELETE",
      credentials: 'include',
    })

    if (!cart.success) {
      console.error("장바구니 삭제 실패:", cart.message);
      return;
    }

    const items = Array.isArray(cart.data) ? cart.data : [];
    get().setCarts(items);
  },

}));

