describe('장바구니 → 주문 → 결제 E2E 테스트', () => {
  beforeEach(() => {
    cy.login('user1@aaa.com', '1111');
  });

  it('담기 → 체크아웃 → 주문 생성 → 결제 성공 리다이렉트', () => {
    // 담기
    cy.visit('/list');
    //서버로 요청 안 가고, Cypress가 대신 응답 생성
    cy.intercept('POST', '**/api/cart/**').as('addCart');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('button[aria-label="add-to-cart"]').click();
    cy.wait('@addCart').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.contains('장바구니에 담겼습니다').should('be.visible');

    // 장바구니 → 체크아웃
    cy.visit('/cart');
    cy.get('button[aria-label="Checkout"]').click();
    cy.location('pathname').should('include', '/checkout');

    // 네트워크 인터셉트
    cy.intercept({ method: 'POST', url: /\/api\/orders(\/)?$/ }).as('createOrder');

    // Confirm 컴포넌트가 기대하는 스키마로 목 응답
    cy.intercept('GET', '**/api/payments/*', (req) => {
      const paymentKey = req.url.split('/').pop();
      req.reply({
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: { // 응답 생성
          paymentKey,
          orderId: 'abc123',
          orderName: '장바구니 결제',
          totalAmount: 35175,
          status: 'DONE'
        },
      });
    }).as('getPayment');

    cy.intercept('POST', '**/api/toss/confirm', {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: {
        status: 'DONE',
        paymentKey: 'pay_test_123',
        orderId: 'abc123',
        approvedAt: new Date().toISOString(),
      },
    }).as('confirm');

    // 배송 정보 입력
    cy.get('input[name="receiver"]').type('홍길동');
    cy.get('input[name="address"]').type('서울시 종로구 123');
    cy.get('input[name="zipCode"]').type('12345');
    cy.get('input[name="phone"]').type('01012345678');
    cy.get('input[name="message"]').type('문 앞에 부탁드려요');

    // Toss SDK 스텁: 앱이 전달한 successUrl 그대로 사용
    cy.window().then((win: any) => {
      win.TossPayments = () => ({ // 원래 SDK 대신 만든 가짜 객체
        requestPayment: (_method: string, payload: any) => {
          // 실제 결제창 대신 successUrl로 강제 이동시킴
          const url = new URL(payload.successUrl, win.location.origin);
          url.searchParams.set('paymentKey', 'pay_test_123');
          url.searchParams.set('orderId', payload.orderId);
          url.searchParams.set('amount', String(payload.amount));
          console.log('[E2E] redirect to:', url.toString());
          win.location.assign(url.toString());
        },
      });
    });
    //
    // // 결제 버튼 클릭 → 주문 생성 요청 발생
    cy.get('button[aria-label="Payment"]').click();
    //
    // // 네트워크 흐름 확인
    // cy.wait(['@createOrder', '@getPayment', '@confirm'], { timeout: 15000 })
    //   .then((intercepts) => {
    //     intercepts.forEach((i) => expect(i.response?.statusCode).to.be.oneOf([200, 201]));
    //   });
    //
    // // 라우팅/화면 검증
    // cy.location('pathname', { timeout: 15000 })
    //   .should('match', /^\/order\/confirmation(\/|$)/);
    //
    // // paymentKey까지 정확히 체크
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq('/order/confirmation/pay_test_123');
    // });
    //
    // // 성공 문구 확인
    // cy.contains(/주문이 완료되었습니다/i).should('be.visible');

  });
});
