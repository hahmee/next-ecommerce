describe('상품등록 E2E 테스트', () => {
    beforeEach(() => {
        // 커스텀 명령어로 로그인
        cy.login('user1@aaa.com', '1111');
        cy.visit('/admin/products/add-product'); // ✅ 등록 페이지로 이동

    });
    it('정상적으로 상품을 등록할 수 있어야 한다', () => {

        cy.get('input[name="pname"]').type('테스트 상품', { force: true });
        cy.get('input[name="price"]').type('15000', { force: true });
        cy.get('input[name="sku"]').type('SKU123', { force: true });

        cy.get('input[name="receiver"]').should('not.exist'); // 등록폼에 불필요한 필드 방지 체크

        // 이미지 업로드
        cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.jpg', { force: true });

        // 라디오 버튼 (판매중)
        cy.get('input[type="radio"][value="ONSALE"]').check({ force: true });

        // 멀티 셀렉트 사이즈
        cy.get('[data-testid="multiSizeSelect"]').click();
        cy.contains('S').click();
        cy.contains('M').click();
        cy.get('body').click(0, 0); // 닫기용

        // 카테고리 선택
        cy.get('[data-testid="category-select"] button').first().click();
        cy.contains('카테고리명1').click();
        cy.contains('카테고리명2').click(); // 최하위 카테고리

        // 색상 추가
        cy.get('[data-testid="color-add"] input[name="color"]').type('#ff0000', { force: true });
        cy.get('[data-testid="color-add"] input[name="text"]').type('레드', { force: true });
        cy.get('[data-testid="color-add"] button[type="submit"]').click();

        // 에디터
        cy.get('.ql-editor').type('테스트 상세 설명입니다.', { force: true });

        // 환불/교환 정책
        cy.get('textarea[name="refundPolicy"]').type('환불 정책 테스트', { force: true });
        cy.get('textarea[name="changePolicy"]').type('교환 정책 테스트', { force: true });

        // 제출
        cy.get('form[data-testid="product-form"] button[type="submit"]').click();

        // 업로드 성공 토스트
        cy.contains('업로드 성공했습니다.').should('exist');
        cy.url().should('include', '/admin/products');
    });
});
