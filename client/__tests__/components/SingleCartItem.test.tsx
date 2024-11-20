import {fireEvent, render, screen} from "@testing-library/react";
import SingleCartItem from "@/components/Home/SingleCartItem";
import {getCookie} from "cookies-next";
import {useCartStore} from "@/store/cartStore";
import {CartItemList} from "@/interface/CartItemList";


// Mock 처리
jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

// jest.mock("@/store/cartStore");

jest.mock("@/store/cartStore", () => ({
    useCartStore: jest.fn(), // Zustand store를 Mock 함수로 선언
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
}));

// jest.setup.js 또는 테스트 파일 상단에 추가
jest.mock('cookies-next', () => ({
    getCookie: jest.fn(),
}));

const cookieValue = JSON.stringify({
    "password": "",
    "social": false,
    "nickname": "USER1",
    "accessToken": "your-access-token",
    "roleNames": ["ADMIN"],
    "email": "user1@aaa.com",
    "refreshToken": "your-refresh-token"
});

const mockCartItem: CartItemList  = {
    cino: 43,
    qty: 7,
    pno: 1,
    pname: "White Clothes..",
    price: 23,
    imageFile: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/66c8028e-859d-43cb-8ea3-7dae4f218a44_kizkopop-aYGvHIwhm5c-unsplash.jpg",
    size: "L",
    color: {
        id: 1,
        text: "red",
        color: "#ff0000"
    },
    sellerEmail: "user1@aaa.com",
}

const mockCartStore = {
    carts: [mockCartItem] as CartItemList[],
    changeCart: jest.fn(),  // changeCart 함수 모킹 추가
    removeItem: jest.fn(),
};

describe("SingleCartItem Component", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전 Mock 초기화

        (useCartStore as jest.MockedFunction<typeof useCartStore>).mockReturnValue(mockCartStore);
        (getCookie as jest.Mock).mockReturnValue(cookieValue);

    });


    it('should render the SingleCartItem component', () => {

        render(<SingleCartItem cartItem={mockCartItem}/>);

        expect(screen.getByText(mockCartItem.pname)).toBeInTheDocument();

        expect(screen.getByText(mockCartItem.qty)).toBeInTheDocument();

        expect(screen.getByText(mockCartItem.price + " 원")).toBeInTheDocument();

        expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeInTheDocument();

        expect(screen.getByRole("button", { name: /increase quantity/i })).toBeInTheDocument();

        expect(screen.getByRole("button", { name: /remove item/i })).toBeInTheDocument();

    });


    it('should increase quantity when the + button is clicked', () => {

        render(<SingleCartItem cartItem={mockCartItem}/>);

        const increaseButton = screen.getByRole("button", {name: /increase quantity/i});
        const quantityDisplay = screen.getByText(mockCartItem.qty);
        const qty = mockCartItem.qty + 1;

        fireEvent.click(increaseButton);

        //changeCart가 호출되는지 확인한다.
        expect(mockCartStore.changeCart).toHaveBeenCalledWith({
            ...mockCartItem,
            qty: mockCartItem.qty + 1, // 증가된 수량
        });

        expect(quantityDisplay).toHaveTextContent(qty.toString()); // 수량이 증가해야 함


    });

    it('should decrease quantity when the - button is clicked', () => {

        render(<SingleCartItem cartItem={mockCartItem}/>);

        const decreaseButton = screen.getByRole("button", {name: /decrease quantity/i});
        const quantityDisplay = screen.getByText(mockCartItem.qty);
        const qty = mockCartItem.qty - 1;

        fireEvent.click(decreaseButton);
        //changeCart가 호출되는지 확인한다.
        expect(mockCartStore.changeCart).toHaveBeenCalledWith({
            ...mockCartItem,
            qty: mockCartItem.qty - 1, // 감소된 수량
        });

        expect(quantityDisplay).toHaveTextContent(qty.toString()); // 수량이 감소해야 함

    });


    it('should remove item when the remove button is clicked', () => {

        render(<SingleCartItem cartItem={mockCartItem}/>);

        const removeButton = screen.getByRole("button", {name: /remove item/i});
        // const quantityDisplay = screen.getByText(mockCartItem.qty);
        // const qty = mockCartItem.qty - 1;

        fireEvent.click(removeButton);
        // expect(quantityDisplay).toHaveTextContent(qty.toString()); // 수량이 증가해야 함

        // removeItem 함수가 호출되었는지 확인
        expect(mockCartStore.removeItem).toHaveBeenCalledWith(mockCartItem.cino);

    });


    it('should not decrease quantity below 1', () => {
        const cartItemWithMinQty = { ...mockCartItem, qty: 1 };
        render(<SingleCartItem cartItem={cartItemWithMinQty} />);

        const decreaseButton = screen.getByRole("button", { name: /decrease quantity/i });
        fireEvent.click(decreaseButton);

        expect(mockCartStore.changeCart).not.toHaveBeenCalled(); // 호출되지 않아야 함
    });

});

