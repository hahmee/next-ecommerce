import {setupServer} from 'msw/node'; // msw/node에서 setupServer를 가져옵니다.
import {http, HttpResponse} from "msw";
import {mockProducts} from "../__mocks__/productFormMockData";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {render} from "@testing-library/react";
import {Mode} from "@/types/mode";

const pno = '49';
// 기본 API 응답값 - 수정일 때 원래 값
const server = setupServer(
    http.get(`/api/products/${pno}`, () => {
        return HttpResponse.json(mockProducts);
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// describe("수정일 때 ", () => {
//     it("주문금액이 0원일 때 PointSection은 노출되지 않는다", async () => {
//         const { container } = customRender(<PointSection />, { orderAmount: 0 });
//
//         // 컴포넌트가 렌더링되지 않았는지 확인
//         expect(container.firstChild).toBeNull();
//     });
// });

describe("API 응답 테스트", () => {
    it("상품 조회에 성공하면 상품 정보가 렌더링된다", async () => {
        // 주문금액: 10,000원
        render(<ProductForm type={Mode.EDIT} id={pno}/>);

        // // API 응답 대기 상태에 로더가 렌더링되는지 확인
        // expect(screen.getByText("Loading...")).toBeInTheDocument();
        //
        // // API 조회가 완료되면 상품 정보가 렌더링되는지 확인
        // await screen.findByText(mockProducts.pname);
        // await screen.findByText(mockProducts.pdesc);
        // await screen.findByText(mockProducts.price);



    });
});