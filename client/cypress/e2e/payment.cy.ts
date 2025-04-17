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
                // 실제 결제 창 대신 successUrl로 리다이렉트 시뮬레이션
                win.location.href = options.successUrl;
                return Promise.resolve();
            }).as('requestPaymentStub');
        });

    });

    it('should fill out shipping info and submit payment form', () => {
        // 배송 정보 입력 필드에 데이터 입력
        cy.get('input[name="receiver"]').type('Test Receiver');
        cy.get('input[name="address"]').type('123 Test Street');
        cy.get('input[name="zipCode"]').type('12345');
        cy.get('input[name="phone"]').type('01012345678');
        cy.get('input[name="message"]').type('Leave at door');

        // 주문 저장 API 호출을 인터셉트 (네트워크 요청 모킹)
        cy.intercept('POST', '/api/orders/', {
            success: true,
            code: 0,
            message: "SUCCESS"
        }).as('orderSave');

        // 주문 저장 API 호출이 완료될 때까지 대기
        cy.wait('@orderSave');
        // 폼 제출
        cy.get('button[name="payment"]').click();


        //
        // // 결제 성공 후, TossPayments에서 설정한 successUrl (/order/success)로 리다이렉트 되었는지 확인
        // cy.url().should('include', '/order/success');
        //
        // // 추가적으로 결제 성공 메시지가 있다면 검증
        // cy.contains('Payment Successful').should('be.visible');

    });

});