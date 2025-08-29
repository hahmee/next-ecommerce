import { fireEvent, render, screen } from '@testing-library/react';
import AddCart from '@/components/Home/Cart/AddCart';
import { SalesStatus, SalesStatusKor } from '@/types/salesStatus';
import { Size } from '@/types/size';

// Mock 처리
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}));

describe('AddCart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 테스트 전 Mock 초기화
  });

  const pno = 1;
  const options = { color: { id: 1, text: 'red', color: '#ff0000' }, size: Size.L };
  const sellerEmail = 'user1@naver.com';

  it('should render the AddCart component', () => {
    render(
      <AddCart
        pno={pno}
        salesStatus={SalesStatus.ONSALE}
        options={options}
        sellerEmail={sellerEmail}
      />,
    );

    expect(screen.getByText('Choose a Quantity')).toBeInTheDocument();
    expect(screen.getByText(SalesStatusKor[SalesStatus.ONSALE])).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });

  it('should increase quantity when the + button is clicked', () => {
    render(
      <AddCart
        pno={pno}
        salesStatus={SalesStatus.ONSALE}
        options={options}
        sellerEmail={sellerEmail}
      />,
    );

    const increaseButton = screen.getByText('+');
    const quantityDisplay = screen.getByText('1');

    fireEvent.click(increaseButton);
    expect(quantityDisplay).toHaveTextContent('2'); // 수량이 증가해야 함
  });

  it('should not allow quantity to be less than 1', () => {
    render(
      <AddCart
        pno={pno}
        salesStatus={SalesStatus.ONSALE}
        options={options}
        sellerEmail={sellerEmail}
      />,
    );

    const decreaseButton = screen.getByText('-');
    const quantityDisplay = screen.getByText('1');

    fireEvent.click(decreaseButton);

    expect(quantityDisplay).toHaveTextContent('1'); // 수량은 1로 유지되어야 함
  });

  it('should disable Add to Cart button if the status is not ONSALE', () => {
    render(
      <AddCart
        pno={pno}
        salesStatus={SalesStatus.SOLDOUT}
        options={options}
        sellerEmail={sellerEmail}
      />,
    );

    const addButton = screen.getByRole('button', { name: 'Add to Cart' });

    expect(addButton).toBeDisabled(); // Add to Cart 버튼이 비활성화되어야 함
  });
});

// 모달에서
// describe("CartComponent", () => {
//     it("renders items from the cart", () => {
//         // Mock 상태 정의
//         (useCartStore as jest.Mock).mockReturnValue({
//             items: [
//                 { id: 1, name: "Apple", quantity: 2 },
//                 { id: 2, name: "Orange", quantity: 1 },
//             ],
//             addItem: jest.fn(),
//             removeItem: jest.fn(),
//         });
//
//         render(<AddCart/>);
//
//         expect(screen.getByText("Apple")).toBeInTheDocument();
//         expect(screen.getByText("Orange")).toBeInTheDocument();
//     });
// });
