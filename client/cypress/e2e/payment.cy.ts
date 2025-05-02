describe('Payment System E2E Test', () => {
    beforeEach(() => {
        // 결제 페이지로 이동
        cy.login('user1@aaa.com', '1111');

        cy.visit(`${Cypress.config("baseUrl")}/checkout`);

        // TossPayments.requestPayment를 stub 처리하여 결제 성공 플로우 시뮬레이션
        cy.window().then((win) => {
            // tossPayments 객체가 없으면 생성
            if (!win.tossPayments) {
                win.tossPayments = {};
            }
            // requestPayment 메서드가 없다면 기본 함수 할당
            if (!win.tossPayments.requestPayment) {
                win.tossPayments.requestPayment = () => {};
            }
            cy.stub(win.tossPayments, 'requestPayment').callsFake((method, options) => {
                console.log('✅ Toss Success URL:', options.successUrl); // 👈 이거 찍어보세요

                // 실제 결제 창 대신 successUrl로 리다이렉트 시뮬레이션
                win.location.href = options.successUrl;
                return Promise.resolve();
            }).as('requestPaymentStub');
        });

    });

    it('should fill out shipping info and submit payment form', () => {
        // 배송 정보 입력 필드에 데이터 입력
        cy.get('input[name="receiver"]').type('Test Receiver', { force: true });
        cy.get('input[name="address"]').type('123 Test Street', { force: true });
        cy.get('input[name="zipCode"]').type('12345', { force: true });
        cy.get('input[name="phone"]').type('01012345678', { force: true });
        cy.get('input[name="message"]').type('Leave at door', { force: true });

        // // 주문 저장 API 호출을 인터셉트 (네트워크 요청 모킹) -> server 컴포넌트에서 한 거는 intercept로 못 잡음
        // cy.intercept('POST', '**/api/order  s/**').as('orderSave');


        // 결제하기 버튼 클릭
        cy.get('button[aria-label="Payment"]').click({force: true});


        // 결제 성공 페이지로 이동했는지 확인
        // ✅ 성공 URL로 이동했는지 확인
        cy.url().should('include', '/order/confirmation');
        // cy.contains('주문이 완료되었습니다').should('exist');
        //
        // // 결제 함수가 호출됐는지 확인
        // cy.get('@requestPaymentStub').should('have.been.called');

    });

});