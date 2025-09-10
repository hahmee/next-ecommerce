Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');

  // 로그인 API 대기
  cy.intercept('POST', '**/api/member/login').as('loginReq');

  cy.get('input[name="email"]').should('be.visible').clear().type(email);
  cy.get('input[name="password"]').should('be.visible').clear().type(password);
  cy.get('[data-testid="login-submit"]').should('be.enabled').click();

  // 서버 응답 먼저 확인
  cy.wait('@loginReq').its('response.statusCode').should('be.oneOf', [200, 204, 302]);

  // 라우팅 완료까지 동기화
  cy.location('pathname', { timeout: 10000 }).should('not.include', '/login');

  // 토큰 쿠키 존재만 확인
  cy.getCookie('access_token', { timeout: 10000 }).should('exist');
  cy.getCookie('refresh_token', { timeout: 10000 }).should('exist');
});

//최하위 카테고리 선택하기
Cypress.Commands.add('clickUntilLeaf', (level = 0) => {
  function clickNext(lvl: number) {
    cy.get(`[data-testid="category"][data-level="${lvl}"]`)
      .first()
      .then(($el) => {
        if ($el.length > 0) {
          cy.wrap($el).click();
          cy.wait(300); // 필요에 따라 조정
          cy.document().then((doc) => {
            const hasNext = doc.querySelector(`[data-testid="category"][data-level="${lvl + 1}"]`);
            if (hasNext) {
              clickNext(lvl + 1);
            } else {
              cy.log(`최하위 카테고리 도달: level ${lvl}`);
            }
          });
        }
      });
  }

  clickNext(level);
});
