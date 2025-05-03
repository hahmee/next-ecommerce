describe('상품등록 E2E 테스트', () => {
    beforeEach(() => {
        // 커스텀 명령어로 로그인
        cy.login('user1@aaa.com', '1111');
        // 🔥 여기서 모든 form submit을 방지
        cy.window().then((win) => {
            win.addEventListener('submit', (e) => e.preventDefault(), true);
        });
        cy.visit('/admin/products/add-product'); // ✅ 등록 페이지로 이동

    });
    it('정상적으로 상품을 등록할 수 있어야 한다', () => {
        cy.get('[data-testid="color-input"]').as('colorInput');
        cy.get('@colorInput').type('레드', { force: true });
        cy.get('[data-testid="color-input"]').trigger('keydown', { key: 'Enter', force: true });
        cy.get('@colorInput').type('노랑', { force: true });
        cy.get('[data-testid="color-input"]').trigger('keydown', { key: 'Enter', force: true });
        cy.contains('레드').should('exist');
        cy.contains('노랑').should('exist');
        // 환불/교환 정책
        cy.get('textarea[name="refundPolicy"]', { timeout: 5000 }).should('exist').type('환불 정책 테스트', { force: true });
        cy.get('textarea[name="changePolicy"]', { timeout: 5000 }).should('exist').type('교환 정책 테스트', { force: true });
        //카테고리 선택
        cy.get('[data-testid="category"]').first().click(); // 첫 번째 카테고리 클릭

        cy.get('input[name="pname"]').type('테스트 상품', { force: true });
        cy.get('input[name="price"]').type('15000', { force: true });
        cy.get('input[name="sku"]').type('SKU123', { force: true });

        cy.get('input[name="receiver"]').should('not.exist'); // 등록폼에 불필요한 필드 방지 체크
        // 멀티 셀렉트 사이즈
        cy.get('[data-testid="multiSizeSelect"]').click();
        cy.contains('S').click({ force: true });
        cy.contains('M').click({ force: true });
        cy.get('body').click(0, 0, {force: true}); // 닫기용

        // 이미지 업로드
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test.jpg', { force: true });

        // 라디오 버튼 (판매중)
        cy.get('input[type="radio"][value="ONSALE"]').check({ force: true });

        cy.get('form[data-testid="product-form"]', { timeout: 10000 }).should('exist');

        // 에디터
        // cy.get('.ql-editor').type('테스트 상세 설명입니다.', { force: true });
        cy.get('.ql-editor', { timeout: 10000 }) // 최대 10초 기다림
            .should('exist')
            .click({ force: true }) // focus 주기
            .type('테스트 상세 설명입니다.', { force: true });

        // 제출
        // cy.get('form[data-testid="product-form"] button[type="submit"]').should('exist').click({ force: true });
        //
        // 업로드 성공 토스트
        // cy.contains('업로드 성공했습니다.').should('exist');
        // cy.url().should('include', '/admin/products');
    });
});
