import {render, screen} from "@testing-library/react";
import SingleCartItem from "@/components/Home/SingleCartItem";

// Mock 처리
jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

// jest.mock("@/store/cartStore");

const mockCartItem = {
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

describe("SingleCartItem Component", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 테스트 전 Mock 초기화

    });

    it('should render the SingleCart component', () => {
        console.log('mockCartItem', mockCartItem);
        render(<SingleCartItem cartItem={mockCartItem}/>);
        expect(screen.getByText('In Stock')).toBeInTheDocument();

        // expect(screen.getByText(mockCartItem.pname)).toBeInTheDocument();
        // expect(screen.getByText(SalesStatusKor[SalesStatus.ONSALE])).toBeInTheDocument();
        // expect(screen.getByRole('button', {name: 'Add to Cart'})).toBeInTheDocument();
    });


});

