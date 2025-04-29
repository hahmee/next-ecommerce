import {setupServer} from 'msw/node'; // msw/node에서 setupServer를
import {http, HttpResponse} from "msw";
import {mockCategories, mockCategoryPaths, mockProducts} from "../__mocks__/productFormMockData";
import ProductTable from "@/components/Admin/Tables/ProductTable";
import {customRender} from "../utils/testUtils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";

const pno = '49';
const cno = '65';


const mockPush = jest.fn();
jest.mock('@/components/Admin/Product/QuillEditor', () => () => {
    return <div>QuillEditor Mock</div>;
});

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// next/headers mock
jest.mock('next/headers', () => ({
    cookies: jest.fn(() => ({
        get: jest.fn(() => ({
            value: JSON.stringify({
                accessToken: "mock-token",
                refreshToken: "mock-refresh-token",
                email: "mock@email.com",
            }),
        })),
    })),
}));

// MSW 서버 설정
const server = setupServer(
    http.get(`/api/products/${pno}`, () => HttpResponse.json(mockProducts)),
    http.get(`/api/category/paths/${cno}`, () => HttpResponse.json(mockCategoryPaths)),
    http.get(`/api/category/list`, () => HttpResponse.json(mockCategories)),
    http.post('/api/products/', () => HttpResponse.json({ success: true })), // 상품 추가
    http.put(`/api/products/${pno}`, () => HttpResponse.json({ success: true })), // 상품 수정
    http.get('/api/products/searchAdminList', ({ request }) => {
        return HttpResponse.json({
            success: true,
            data: [],
            message: "ok",
            code: 200,
        });
    }),
);

// MSW 서버 시작
beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
});
afterAll(() => server.close());

describe('Product 플로우', () => {
    it('상품 추가 버튼을 누르면 ProductForm(추가)로 이동', async () => {
        // 1. 게시판 리스트 렌더
        customRender(<ProductTable />);

        // 2. ProductForm(추가)로 href가 제대로 걸렸는지 확인
        // expect(button.closest('a')).toHaveAttribute('href', '/admin/products/add-product'); <- 쓰지말기
        // expect(mockPush).toHaveBeenCalledWith("/admin/products/add-product"); <- router.push
        const link = screen.getByRole('link', { name: "Add Product" });
        expect(link).toHaveAttribute('href', '/admin/products/add-product');
        
    });

    it('상품을 추가하고 저장하면 게시판 리스트로 이동', async () => {
        // 1. ProductForm(추가) 진입
        customRender(<ProductForm type={Mode.ADD}/>);

        // 기다리기
        const form = screen.getByTestId('product-form');
        expect(form).toBeInTheDocument();

        // 2. input 값 입력 (fireEvent.change)
        fireEvent.change(screen.getByPlaceholderText('상품명을 입력해주세요.'), { target: { value: '새 상품' } });
        fireEvent.change(screen.getByLabelText('판매상태'), { target: { value: 'ONSALE' } });
        fireEvent.change(screen.getByPlaceholderText('판매가격을 입력해주세요.'), { target: { value: '10000' } });
        fireEvent.change(screen.getByPlaceholderText('SKU를 입력해주세요.'), { target: { value: 'SKU-NEW' } });
        // 사이즈 선택 (MultiSelect 열고 옵션 클릭)
        fireEvent.click(screen.getByPlaceholderText('사이즈를 선택해주세요.'));
        const sizeOption = await screen.findByText('M');
        fireEvent.click(sizeOption);
        // 컬러 추가 (ColorSelector)
        fireEvent.change(screen.getByPlaceholderText('컬러를 선택해주세요.'), { target: { value: '블랙' } });
        fireEvent.keyDown(screen.getByPlaceholderText('컬러를 선택해주세요.'), { key: 'Enter', code: 'Enter' });
        fireEvent.change(screen.getByPlaceholderText('환불 정책을 입력해주세요.'), { target: { value: '7일 이내 환불 가능' } });
        fireEvent.change(screen.getByPlaceholderText('교환 정책을 입력해주세요.'), { target: { value: '7일 이내 교환 가능' } });

        // 3. 저장하기 버튼 클릭
        fireEvent.click(screen.getByRole('button', { name: /저장하기/ }));

        // 4. 게시판 리스트로 이동했는지, 추가 상품 보이는지 확인
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/admin/products');
        });
    });

    it('상품을 선택하면 ProductForm(수정)으로 이동', () => {
        // 1. 게시판 리스트 렌더
        // 2. 특정 상품(리스트 아이템) 클릭
        // 3. ProductForm(수정) 진입 및 기존 데이터가 입력창에 있는지 확인
    });

    it('상품 수정 후 저장하면 게시판 리스트로 이동', async () => {
        // 1. ProductForm(수정) 진입
        // 2. 값 수정 (fireEvent.change)
        // 3. 수정하기 버튼 클릭
        // 4. 게시판 리스트로 이동/수정된 상품 보이는지 확인
    });

    // (옵션)
    it('필수값 미입력 시 에러 메시지 노출', () => {
        // 1. ProductForm 진입
        // 2. 아무것도 입력 안하고 저장하기 클릭
        // 3. 에러 메시지 뜨는지 확인
    });
});
