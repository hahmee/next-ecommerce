import { useCartStore } from "@/store/cartStore";
import {CartItemList} from "@/interface/CartItemList";

describe("useCartStore", () => {
    beforeEach(() => {
        useCartStore.setState({
            carts: [],
            isLoading: true,
            counter: 0,
            open: false,
            subtotal: 0,
            shippingFee: 0,
            tax: 0,
            total: 0,
        });
    });

    it("setCarts(): 가격, 배송비, 세금 계산이 정확히 된다", () => {
        const sample: CartItemList[] = [
            {
                cino: 1,
                qty: 2,
                pno: 100,
                pname: "item1",
                price: 10000,
                imageFile: "item1.jpg",
                size: "M",
                color: { id: 1, text: "Red", color: "#FF0000" },
                sellerEmail: "test@example.com",
            },
            {
                cino: 2,
                qty: 1,
                pno: 101,
                pname: "item2",
                price: 5000,
                imageFile: "item2.jpg",
                size: "L",
                color: { id: 2, text: "Blue", color: "#0000FF" },
                sellerEmail: "test2@example.com",
            },
        ];
        useCartStore.getState().setCarts(sample);

        const state = useCartStore.getState();

        expect(state.subtotal).toBe(25000); // 10000*2 + 5000*1
        expect(state.shippingFee).toBe(3500);
        expect(state.tax).toBe(Math.round((25000 + 3500) * 0.05));
        expect(state.total).toBe(25000 + 3500 + state.tax);
        expect(state.counter).toBe(2);
    });
});
