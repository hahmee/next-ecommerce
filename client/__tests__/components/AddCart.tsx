import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SalesStatus, SalesStatusKor } from '@/types/salesStatus';
import { useCartStore } from '@/store/cartStore';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import AddCart from "@/components/Home/AddCart";

// 상태 초기화
const mockCartStore = {
    cart: [],
    changeCart: jest.fn(),
    isLoading: false,
    changeOpen: jest.fn(),
};

// Jest mock 설정
jest.mock('@/store/cartStore', () => ({
    useCartStore: jest.fn().mockReturnValue(mockCartStore),
}));
jest.mock('cookies-next', () => ({
    getCookie: jest.fn()
}));
jest.mock('react-hot-toast', () => ({
    success: jest.fn()
}));

describe('<AddCart />', () => {
    beforeEach(() => {
        getCookie.mockReturnValue(JSON.stringify({ email: 'testuser@example.com' }));
    });

    it('should render the AddCart component', () => {
        render(<AddCart pno={1} salesStatus={SalesStatus.ONSALE} options={{ color: { id: 1212, text:"asdfas", color:'asdf' }, size: 'M' }} sellerEmail="seller@example.com" />);

        expect(screen.getByText('Choose a Quantity')).toBeInTheDocument();
        expect(screen.getByText(SalesStatusKor[SalesStatus.ONSALE])).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
    });

    it('should increase quantity when the + button is clicked', () => {
        render(<AddCart pno={1} salesStatus={SalesStatus.ONSALE} options={{ color:  { id: 1212, text:"asdfas", color:'asdf' }, size: 'M' }} sellerEmail="seller@example.com" />);

        const increaseButton = screen.getByText('+');
        const quantityDisplay = screen.getByText('1');

        fireEvent.click(increaseButton);

        expect(quantityDisplay).toHaveTextContent('2'); // 수량이 증가해야 함
    });

    it('should decrease quantity when the - button is clicked', () => {
        render(<AddCart pno={1} salesStatus={SalesStatus.ONSALE} options={{ color:  { id: 1212, text:"asdfas", color:'asdf' }, size: 'M' }} sellerEmail="seller@example.com" />);

        const decreaseButton = screen.getByText('-');
        const quantityDisplay = screen.getByText('1');

        fireEvent.click(decreaseButton);

        expect(quantityDisplay).toHaveTextContent('0'); // 수량이 0보다 작지 않아야 함
    });

    it('should not allow quantity to be less than 1', () => {
        render(<AddCart pno={1} salesStatus={SalesStatus.ONSALE} options={{ color: { id: 1212, text:"asdfas", color:'asdf' }, size: 'M' }} sellerEmail="seller@example.com" />);

        const decreaseButton = screen.getByText('-');
        const quantityDisplay = screen.getByText('1');

        fireEvent.click(decreaseButton);
        fireEvent.click(decreaseButton); // 두 번 클릭하여 수량을 0 이하로 만들려고 시도

        expect(quantityDisplay).toHaveTextContent('1'); // 수량은 1로 유지되어야 함
    });

    it('should call changeCart when Add to Cart button is clicked', async () => {
        render(<AddCart pno={1} salesStatus={SalesStatus.ONSALE} options={{ color:  { id: 1212, text:"asdfas", color:'asdf' }, size: 'M' }} sellerEmail="seller@example.com" />);

        const addButton = screen.getByRole('button', { name: 'Add to Cart' });

        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockChangeCart).toHaveBeenCalledTimes(1); // changeCart가 한 번 호출되었는지 확인
        });
    });

    it('should display success toast when Add to Cart button is clicked', async () => {
        render(<AddCart pno={1} salesStatus={SalesStatus.ONSALE} options={{ color:  { id: 1212, text:"asdfas", color:'asdf' }, size: 'M' }} sellerEmail="seller@example.com" />);

        const addButton = screen.getByRole('button', { name: 'Add to Cart' });

        fireEvent.click(addButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('장바구니에 담겼습니다.'); // toast가 호출되었는지 확인
        });
    });

    it('should disable Add to Cart button if the status is not ONSALE', () => {
        render(<AddCart pno={1} salesStatus={SalesStatus.SOLDOUT} options={{ color:  { id: 1212, text:"asdfas", color:'asdf' }, size: 'M' }} sellerEmail="seller@example.com" />);

        const addButton = screen.getByRole('button', { name: 'Add to Cart' });

        expect(addButton).toBeDisabled(); // Add to Cart 버튼이 비활성화되어야 함
    });
});
