import {customRender} from "../utils/testUtils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {Mode} from "@/types/mode";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";
import CategoryTable from "@/components/Admin/Tables/CategoryTable";
import CategoryForm from "@/components/Admin/Category/CategoryForm";
import {mockCategories, mockCategoryPaths, mockGetCategory} from "../__mocks__/categoryFormMockData";
import toast from "react-hot-toast";

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));


jest.mock('next/headers', () => ({
    cookies: jest.fn(() => new Map([['accessToken', 'mock-token']])),
}));

jest.mock('@/utils/cookie', () => ({
    getCookie: jest.fn(() => ({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        email: 'mock@example.com',
    })),
    setCookie: jest.fn(),
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
    }),
    http.get("/api/category/searchAdminList", () => {
        return HttpResponse.json({
            success: true,
            code: 200,
            message: "",
            data: mockCategories
        });
    }),
    http.get("/api/category/17", () => {
        return HttpResponse.json({
            success: true,
            code: 200,
            message: "",
            data: mockGetCategory,
        });
    }),
    http.get("/api/category/paths/17", () => {
        return HttpResponse.json({
            success: true,
            code: 200,
            message: "",
            data: mockCategoryPaths,
        });
    }),
    http.put("/api/category/17", async ({ request }) => {
        const formData = await request.formData();
        return HttpResponse.json({
            success: true,
            code: 200,
            message: "카테고리 수정 성공",
            data: {
                cno: 17,
                cname: formData.get("cname"),
                cdesc: formData.get("cdesc"),
                parentCategoryId: formData.get("parentCategoryId"),
                uploadFileName: formData.get("uploadFileName"),
                uploadFileKey: formData.get("uploadFileKey"),
            },
        });
    }),

);

beforeAll(() => {
    server.listen();
    global.URL.createObjectURL = jest.fn(() => '/mock-preview-url');

    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
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
        fireEvent.change(cnameInput, {target: {value: '테스트카테고리'}});

        // 설명 입력
        const cdescInput = screen.getByPlaceholderText("카테고리 설명을 입력해주세요.");
        fireEvent.change(cdescInput, {target: {value: '설명입니다'}});

        // 파일 업로드
        const file = new File(['dummy'], 'test.png', {type: 'image/png'});
        const fileInput = screen.getByLabelText("사진첨부");
        fireEvent.change(fileInput, {target: {files: [file]}});

        // 제출
        const submitButton = screen.getByRole('button', {name: /카테고리 추가/i});
        fireEvent.click(submitButton);

        // 이동 확인
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/admin/category");
        });
    });

    it('카테고리를 선택하면 CategoryForm(수정)으로 이동', async () => {
        // 1. 카테고리 리스트 렌더
        customRender(<CategoryTable />);

        // "수정" 메뉴가 나타나기 전엔 query에 의해 로딩이 되므로 기다려줌
        const categoryName = await screen.findByText('test-data');
        expect(categoryName).toBeInTheDocument();

        // 2. 드롭다운 버튼 클릭
        const actionButtons = screen.getAllByTestId('action-button');
        fireEvent.click(actionButtons[0]);

        // 2. "수정" 링크가 나타나는지 확인
        const editLink = await screen.findByTestId('edit-link');
        expect(editLink).toBeInTheDocument();

        // 3. CategoryForm(수정) 진입 및 기존 데이터가 입력창에 있는지 확인
        customRender(<CategoryForm type={Mode.EDIT} id="17" />); // 17번 카테고리 수정

        // 4. 기존 데이터가 폼에 채워져 있는지 확인
        const nameInput = await screen.findByDisplayValue("test-data"); // cname
        const descInput = await screen.findByDisplayValue("test"); // cdesc

        expect(nameInput).toBeInTheDocument();
        expect(descInput).toBeInTheDocument();

    });
    //
    it('카테고리 수정 후 저장하면 카테고리 리스트로 이동', async () => {
        customRender(<CategoryForm type={Mode.EDIT} id="17" />);

        // 기존 값 확인
        const nameInput = await screen.findByDisplayValue("test-data");
        const descInput = await screen.findByDisplayValue("test");

        // 값 수정
        fireEvent.change(nameInput, { target: { value: '수정된 카테고리' } });
        fireEvent.change(descInput, { target: { value: '수정된 설명' } });

        // 제출
        const submitButton = screen.getByRole('button', { name: /카테고리 수정/i });
        fireEvent.click(submitButton);

        // 이동 확인
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/admin/category");
        });

        //수정됐는지 확인
        await waitFor(() => {
            const updated = screen.getByText("수정된 카테고리");
            expect(updated).toBeInTheDocument();
        });
    });

    it('필수값 미입력 시 에러 메시지 노출', async () => {
        // 1. CategoryForm 진입
        customRender(<CategoryForm type={Mode.ADD} />);
        // 2. 아무것도 입력 안하고 저장하기 클릭
        const submitButton = screen.getByRole('button', { name: /카테고리 추가/i });
        fireEvent.click(submitButton);
        // 3. 에러 메시지 뜨는지 확인
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("카테고리명은 필수입니다.");
        });
    });

    //삭제
    it('카테고리 삭제하면 카테고리 리스트로 이동', async () => {
        customRender(<CategoryTable />);

        // "삭제" 메뉴가 나타나기 전엔 query에 의해 로딩이 되므로 기다려줌
        const categoryName = await screen.findByText('test-data');
        expect(categoryName).toBeInTheDocument();

        // 2. 드롭다운 버튼 클릭
        const actionButtons = screen.getAllByTestId('action-button');
        fireEvent.click(actionButtons[0]);

        // 3. "삭제" 버튼을 클릭한다.
        const deleteButton = await screen.findByTestId('delete');
        // fireEvent.click(deleteButton);




    });
});
