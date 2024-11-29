import {setupServer} from 'msw/node'; // msw/node에서 setupServer를 가져옵니다.
import {http, HttpResponse} from "msw";
import {mockCategories, mockCategoryPaths, mockProducts} from "../__mocks__/productFormMockData";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";
import {customRender} from "../utils/testUtils";
import {screen, waitFor,} from "@testing-library/react";
import {wait} from "@testing-library/user-event/dist/cjs/utils.js";
import TestForm from "@/components/Admin/Product/TestForm";







const pno = '49';
const cno = '65';

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(), // push 함수 모킹
    })),
}));

jest.mock('next/headers', () => ({
    cookies: jest.fn(() => ({
        get: jest.fn(() => ({ value: 'mock-cookie-value' })),
    })),
}));

// jest.setup.js 또는 테스트 파일 상단에 추가
jest.mock('cookies-next', () => ({
    getCookie: jest.fn(),
}));

// 기본 API 응답값 - 수정일 때 원래 값
const server = setupServer(
    http.get(`/api/products/${pno}`, () => {return HttpResponse.json(mockProducts);}),
    http.get(`/api/category/paths/${cno}`, () => {return HttpResponse.json(mockCategoryPaths);}),
    http.get(`/api/category/list`, () => {return HttpResponse.json(mockCategories);}),
);

// MSW 서버 시작
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("수정일 때 ", () => {
    it("주문금액이 0원일 때 PointSection은 노출되지 않는다", async () => {
        // const {container, getByText} = customRender(<ProductForm type={Mode.EDIT} id={pno}/>);
        const { container, getByText } = customRender(<TestForm/>);
        // await waitFor(() => getByText('야호!!')); // 콜백 안의 함수가 에러를 발생시키지 않을 때 까지 기다립니다.
        await waitFor(() => expect(container).toHaveTextContent(mockProducts.data.pname));


        // eslint-disable-next-line testing-library/prefer-screen-queries
        getByText("수정하기");
        //
        // setTimeout(() => {
        //     expect(container).toHaveTextContent(mockProducts.data.pname+"asdf");
        // }, 100);//this works

        // await waitFor(() => expect(container).toHaveTextContent(mockProducts.data.pname));

    });
});

describe("API 응답 테스트", () => {
    it("상품 조회에 성공하면 상품 정보가 렌더링된다", async () => {
        // console.log('server', server);

        // 상태를 변경하거나, 렌더링을 트리거하는 작업
        customRender(<ProductForm type={Mode.EDIT} id={pno}/>);

        // const submitButton = screen.getByText('`수정하기`');
        // expect(submitButton).toBeInTheDocument(); // not work

        // API 응답 대기 상태에 로더가 렌더링되는지 확인 (대소문자 구분 x)
        expect(screen.getByText(/loading.../i)).toBeInTheDocument();

        // const categoryText = await screen.findByText("카테고리");
        // expect(categoryText).toBeInTheDocument(); // not work

        // await waitFor(() => {
        //     expect(screen.getByText("카테고리")).toBeInTheDocument();
        // }); // not work

        // await screen.findByText("카테고리");//not work
        //
        // setTimeout(() => {
        //     expect(screen.findByText('카테고리')).toBeInTheDocument();
        // }, 100);//this works


    });
});


