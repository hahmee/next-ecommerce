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
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isLoading: true,
  counter: 0,
  getCart: async () => {

    try {
      const cart = await fetchWithAuth(`/api/cart/items`, {
        method: "GET",
        credentials: 'include',
      });
      console.log('result', cart.data);

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
    console.log('cartItem', cartItem);

    const response = await fetchWithAuth(`/api/cart/change`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartItem),
    })

    // set((state) => ({ ...state, isLoading: true }));
    // const response = await wixClient.currentCart.addToCurrentCart({
    //   lineItems: [
    //     {
    //       catalogReference: {
    //         appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
    //         catalogItemId: productId,
    //         ...(variantId && { options: { variantId } }),
    //       },
    //       quantity: quantity,
    //     },
    //   ],
    // });
    //
    // set({
    //   cart: response.cart,
    //   counter: response.cart?.lineItems.length,
    //   isLoading: false,
    // });
  },

  removeItem: async (cino) => {
    // set((state) => ({ ...state, isLoading: true }));
    // const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
    //   [itemId]
    // );
    //
    // set({
    //   cart: response.cart,
    //   counter: response.cart?.lineItems.length,
    //   isLoading: false,
    // });
  },

}));
