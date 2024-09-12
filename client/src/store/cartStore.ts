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

    const resultJson = await fetchWithAuth(`/api/cart/items`, {
      method: "GET",
      credentials: 'include',
      // body: formData as FormData,
      // headers: { 'Content-Type': 'multipart/form-data' }
    }); // json 형태로 이미 반환
    console.log('result', resultJson);
    // try {
    //
    //   // console.log('ddd', wixClient.currentCart.getCurrentCart());
    //   // const cart = await wixClient.currentCart.getCurrentCart();
    //   // const cart = [];
    //   //
    //   // console.log('cart', cart);
    //   // set({
    //   //   cart: cart || [],
    //   //   isLoading: false,
    //   //   counter: cart?.lineItems.length || 0,
    //   // });
    // } catch (err) {
    //   // set((prev) => ({ ...prev, isLoading: false }));
    // }
  },
  changeCart: async (cartItem) => {
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
