describe('장바구니 → 주문 → 결제 E2E 테스트', () => {
    beforeEach(() => {
        // 커스텀 명령어로 로그인
        cy.login('user1@aaa.com', '1111');
    });

    it('상품을 장바구니에 담는다', () => {
        cy.visit('/list'); // 상품 목록 페이지
        cy.get('[data-testid="product-card"]').first().click(); // 첫 번째 상품 클릭
        cy.get('button[aria-label="add-to-cart"]').click(); // 장바구니 담기
        cy.contains('장바구니에 담겼습니다');
    });
    //
    it('장바구니에서 주문 페이지로 이동', () => {
        cy.visit('/cart');
        cy.get('button[aria-label="Checkout"]').click();
        cy.url().should('include', '/checkout');
    });
    //
    it('주문 정보를 입력하고 결제 진행', () => {
        cy.visit('/checkout');

        // 배송 정보 입력
        cy.get('input[name="receiver"]').type('홍길동', { force: true });
        cy.get('input[name="address"]').type('서울시 종로구 123', { force: true });
        cy.get('input[name="zipCode"]').type('12345', { force: true });
        cy.get('input[name="phone"]').type('01012345678', { force: true });
        cy.get('input[name="message"]').type('문 앞에 부탁드려요', { force: true });

        // 결제하기 버튼 클릭
        cy.get('button[aria-label="Payment"]').click({force: true});

        // 실제 결제 대신 강제로 확인 페이지로 이동
        cy.visit('/order/confirmation/test-mock-payment');
        cy.contains('주문이 완료되었습니다');

        //장바구니 비어있기 확인
        cy.visit('/cart');
        cy.contains('Cart is Empty').should('exist');

    });
});
