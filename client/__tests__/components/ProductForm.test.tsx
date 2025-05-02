import {setupServer} from 'msw/node'; // msw/node에서 setupServer를
import {http, HttpResponse} from "msw";
import {mockCategories, mockCategoryPaths, mockProducts} from "../__mocks__/productFormMockData";
import ProductTable from "@/components/Admin/Tables/ProductTable";
import {customRender} from "../utils/testUtils";
import {fireEvent, screen} from "@testing-library/react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";
import {useProductImageStore} from "@/store/productImageStore";
import userEvent from '@testing-library/user-event';
import {useMutation} from "@tanstack/react-query";

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
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useMutation: jest.fn(),
}));
const user = userEvent.setup(); // user를 세팅하고

// MSW 서버 시작
beforeAll(() =>  {
    server.listen();
    global.URL.createObjectURL = jest.fn(() => '/mock-url');
});
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

    // 이미지 스토어에 강제로 파일 하나 세팅
    beforeEach(() => {
        const store = useProductImageStore.getState();
        store.setFiles([{ id: 0, file: new File(['dummy'], 'test.png', { type: 'image/png' }), dataUrl: '/mock-url', size: 1000 }]);
    });

    it('상품을 추가하고 저장하면 게시판 리스트로 이동', async () => {
        const user = userEvent.setup();

        // 1. mutation.mutate를 mock으로 감시
        const mutateMock = jest.fn();
        (useMutation as jest.Mock).mockReturnValue({ mutate: mutateMock });

        // 1. ProductForm(추가) 진입
        customRender(<ProductForm type={Mode.ADD}/>);

        // 3. 입력
        await user.type(screen.getByPlaceholderText("상품명을 입력해주세요."), "새 상품");
        fireEvent.click(await screen.findByLabelText("판매중"));
        await user.type(screen.getByPlaceholderText("판매가격을 입력해주세요."), "10000");
        await user.type(screen.getByPlaceholderText("SKU를 입력해주세요."), "SKU-NEW");
        // 사이즈, 컬러 등도 필요한 만큼 추가

        // 환불 정책 입력
        await user.type(screen.getByPlaceholderText("환불 정책을 입력해주세요."), "7일 이내 환불 가능");
        await user.type(screen.getByPlaceholderText("교환 정책을 입력해주세요."), "7일 이내 교환 가능");

        // (참고) 만약 사이즈나 컬러가 필수면 클릭 이벤트도 추가해야 함

        // 4. 폼 제출
        fireEvent.submit(screen.getByTestId("product-form"));

        // 5. mutateMock 호출 검사
        expect(mutateMock).toHaveBeenCalledTimes(1);

        // 여기서 mutateMock이 받은 인자 확인 (e: FormEvent 객체)
        const submitEvent = mutateMock.mock.calls[0][0];
        // target 가져오기
        const form = submitEvent.target as HTMLFormElement;

// FormData 만들어서 값 확인
        const formData = new FormData(form);

        expect(formData.get('pname')).toBe('새 상품');
        expect(formData.get('price')).toBe('10000');
        expect(formData.get('sku')).toBe('SKU-NEW');
        expect(formData.get('refundPolicy')).toBe('7일 이내 환불 가능');
        expect(formData.get('changePolicy')).toBe('7일 이내 교환 가능');

        // // 성공 메시지 or 이동 확인
        // await waitFor(() => {
        //     expect(mockPush).toHaveBeenCalledWith("/admin/products");
        // });

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
