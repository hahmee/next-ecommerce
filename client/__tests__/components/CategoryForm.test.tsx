import {customRender} from "../utils/testUtils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {Mode} from "@/types/mode";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";
import CategoryTable from "@/components/Admin/Tables/CategoryTable";
import CategoryForm from "@/components/Admin/Category/CategoryForm";

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));
jest.mock('next/headers', () => ({
    cookies: jest.fn(() => new Map([['accessToken', 'mock-token']])),
}));
jest.mock('@/utils/fetchJWT', () => ({
    fetchJWT: jest.fn(() =>
        Promise.resolve({
            success: true,
            code: 200,
            message: "",
            data: {
                cno: 16,
                cname: "테스트카테고리",
                cdesc: "설명입니다",
                delFlag: false,
                parentCategoryId: null,
                subCategories: null,
                file: null,
                uploadFileName: "https://...jpeg",
                uploadFileKey: "category/...jpeg"
            }
        })
    ),
}));

// 추가
const server = setupServer(
    http.post("/api/category/", async ({ request }) => {
        const formData = await request.formData();
        return HttpResponse.json({
            success: true,
            code: 0,
            message: "OK",
            data: {
                cno: 16,
                cname: formData.get("cname"),
                cdesc: formData.get("cdesc"),
                delFlag: false,
                parentCategoryId: null,
                subCategories: null,
                file: null,
                uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/....jpeg",
                uploadFileKey: "category/....jpeg"
            },
        });
    })
);

beforeAll(() => {
    server.listen(); // ⬅️ 이 줄 추가
    global.URL.createObjectURL = jest.fn(() => '/mock-preview-url');
});
afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
});

afterAll(() => {
    server.close();
});

describe('Category 플로우', () => {
    it('카테고리 추가 버튼을 누르면 CategoryForm(추가)로 이동', async () => {
        // 1. 카테고리 리스트 렌더
        customRender(<CategoryTable />);
        const link = screen.getByRole('link', { name: "Add Main Category" });
        expect(link).toHaveAttribute('href', '/admin/category/add-category');
        
    });

    it('카테고리를 추가하고 저장하면 카테고리 리스트로 이동', async () => {

        // 1. CategoryForm(추가) 진입
        customRender(<CategoryForm type={Mode.ADD}/>);

        //2. 입력
        const cnameInput = screen.getByPlaceholderText("카테고리명을 입력해주세요.");
        fireEvent.change(cnameInput, { target: { value: '테스트카테고리' } });

        // 설명 입력
        const cdescInput = screen.getByPlaceholderText("카테고리 설명을 입력해주세요.");
        fireEvent.change(cdescInput, { target: { value: '설명입니다' } });

        // 파일 업로드
        const file = new File(['dummy'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByLabelText("사진첨부");
        fireEvent.change(fileInput, { target: { files: [file] } });

        // 제출
        const submitButton = screen.getByRole('button', { name: /카테고리 추가/i });
        fireEvent.click(submitButton);

        // 이동 확인
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/admin/category");
        });
    });
    //
    // it('카테고리를 선택하면 CategoryForm(수정)으로 이동', () => {
    //     // 1. 게시판 리스트 렌더
    //     // 2. 특정 상품(리스트 아이템) 클릭
    //     // 3. ProductForm(수정) 진입 및 기존 데이터가 입력창에 있는지 확인
    // });
    //
    // it('카테고리 수정 후 저장하면 카테고리 리스트로 이동', async () => {
    //     // 1. ProductForm(수정) 진입
    //     // 2. 값 수정 (fireEvent.change)
    //     // 3. 수정하기 버튼 클릭
    //     // 4. 게시판 리스트로 이동/수정된 상품 보이는지 확인
    // });
    //
    // // (옵션)
    // it('필수값 미입력 시 에러 메시지 노출', () => {
    //     // 1. ProductForm 진입
    //     // 2. 아무것도 입력 안하고 저장하기 클릭
    //     // 3. 에러 메시지 뜨는지 확인
    // });
});
