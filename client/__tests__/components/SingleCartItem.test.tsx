import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCookie } from 'cookies-next';

import SingleCartItem from '@/components/Home/Cart/SingleCartItem';
import { CartItemList } from '@/interface/CartItemList';
import { ColorTag } from '@/interface/ColorTag';
import { useCartStore } from '@/store/cartStore';
// Mock 처리
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

// jest.mock("@/store/cartStore");

jest.mock('@/store/cartStore', () => ({
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
  password: 'your-password',
  social: false,
  nickname: 'USER1',
  accessToken: 'your-access-token',
  roleNames: ['ADMIN'],
  email: 'user1@aaa.com',
  refreshToken: 'your-refresh-token',
});

const mockCartItem: CartItemList = {
  cino: 43,
  qty: 7,
  pno: 1,
  pname: 'White Clothes..',
  price: 23,
  imageFile:
    'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/66c8028e-859d-43cb-8ea3-7dae4f218a44_kizkopop-aYGvHIwhm5c-unsplash.jpg',
  size: 'L',
  color: {
    id: 1,
    text: 'red',
    color: '#ff0000',
  } as ColorTag,
  sellerEmail: 'user1@aaa.com',
};

const mockCartStore = {
  carts: [mockCartItem] as CartItemList[],
  changeCart: jest.fn((updatedItem) => {
    // carts에서 해당 아이템 업데이트
    const index = mockCartStore.carts.findIndex(
      (item) =>
        item.pno === updatedItem.pno &&
        item.color.id === updatedItem.color.id &&
        item.size === updatedItem.size,
    );
    if (index !== -1) {
      mockCartStore.carts[index] = updatedItem;
    }
  }),
  removeItem: jest.fn(),
};

describe('SingleCartItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 테스트 전 Mock 초기화

    (useCartStore as jest.MockedFunction<typeof useCartStore>).mockReturnValue(mockCartStore);
    (getCookie as jest.Mock).mockReturnValue(cookieValue);
  });

  it('should render the SingleCartItem component', () => {
    render(<SingleCartItem cartItem={mockCartItem} />);

    expect(screen.getByText(mockCartItem.pname)).toBeInTheDocument();

    expect(screen.getByText(mockCartItem.qty)).toBeInTheDocument();

    expect(screen.getByText(`${mockCartItem.price} 원`)).toBeInTheDocument();

    expect(screen.getByAltText('Product Image')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /increase quantity/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /remove item/i })).toBeInTheDocument();
  });

  it('should increase quantity when the + button is clicked', async () => {
    render(<SingleCartItem cartItem={mockCartItem} />);

    expect(await screen.findByText(7)).toBeInTheDocument();

    await clickButton({ type: 'button', value: 'Increase Quantity' });

    // changeCart 함수가 호출되었는지, 그리고 qty가 8로 변경되었는지 확인
    expect(mockCartStore.changeCart).toHaveBeenCalledWith({
      email: 'user1@aaa.com',
      pno: mockCartItem.pno,
      qty: mockCartItem.qty + 1, // 즉, 8
      color: mockCartItem.color,
      size: mockCartItem.size,
      sellerEmail: mockCartItem.sellerEmail,
    });
  });

  it('should decrease quantity when the - button is clicked', async () => {
    render(<SingleCartItem cartItem={mockCartItem} />);
    expect(await screen.findByText(7)).toBeInTheDocument();

    await clickButton({ type: 'button', value: 'Decrease Quantity' });

    // changeCart가 호출되었는지 확인
    expect(mockCartStore.changeCart).toHaveBeenCalledWith({
      email: 'user1@aaa.com',
      pno: mockCartItem.pno,
      qty: mockCartItem.qty - 1,
      color: mockCartItem.color,
      size: mockCartItem.size,
      sellerEmail: mockCartItem.sellerEmail,
    });

    console.log('mockCartStore.carts', mockCartStore.carts); // qty는 6로 잘 나옴
  });

  it('should remove item when the remove button is clicked', () => {
    render(<SingleCartItem cartItem={mockCartItem} />);

    const removeButton = screen.getByRole('button', { name: /remove item/i });

    fireEvent.click(removeButton);

    // removeItem 함수가 호출되었는지 확인
    expect(mockCartStore.removeItem).toHaveBeenCalledWith(mockCartItem.cino);
  });

  it('should not decrease quantity below 1', () => {
    const cartItemWithMinQty = { ...mockCartItem, qty: 1 };
    render(<SingleCartItem cartItem={cartItemWithMinQty} />);

    const decreaseButton = screen.getByRole('button', { name: /decrease quantity/i });
    fireEvent.click(decreaseButton);

    expect(mockCartStore.changeCart).not.toHaveBeenCalled(); // 호출되지 않아야 함

    expect(decreaseButton).toBeDisabled(); // 버튼이 비활성화되어야 함
  });

  const clickButton = async ({ type, value }: { type: string; value: string }) => {
    const user = userEvent.setup();

    await act(async () => {
      await user.click(await screen.findByRole(type, { name: value }));
    });
  };
});
