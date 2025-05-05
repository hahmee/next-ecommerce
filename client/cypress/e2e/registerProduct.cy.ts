describe('상품등록 E2E 테스트', () => {
    beforeEach(() => {
        // 커스텀 명령어로 로그인
        cy.login('user1@aaa.com', '1111');

        cy.visit('/admin/products/add-product'); // 등록 페이지로 이동

    });
    it('정상적으로 상품을 등록할 수 있어야 한다', () => {
        //카테고리 선택
        cy.clickUntilLeaf(); // 0부터 시작해서 끝까지 자동 클릭

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
        cy.get('input[name="pname"]').type('테스트 상품', { force: true });
        cy.get('input[name="price"]').type('15000', { force: true });
        cy.get('input[name="sku"]').type('SKU123', { force: true });

        cy.get('input[name="receiver"]').should('not.exist'); // 등록폼에 불필요한 필드 방지 체크
        // 멀티 셀렉트 사이즈
        cy.get('[data-testid="multiSizeSelect"]').click({ force: true });

        cy.get('[data-testid="multiSelectValue"]').first().click({ force: true });
        cy.get('body').type('{esc}', {force: true}); // 드롭다운 닫기

        // 이미지 업로드
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test.jpg', { force: true });

        // 라디오 버튼 (판매중)
        cy.get('input[type="radio"][value="ONSALE"]').check({ force: true });

        cy.get('form[data-testid="product-form"]', { timeout: 10000 }).should('exist');

        cy.get('.ql-editor', { timeout: 10000 })
            .should('exist')
            .click({ force: true })
            .type('테스트 상세 설명입니다.', { force: true });

        cy.get('button[type="submit"]').should('exist').click({ force: true });

        cy.contains('업로드 성공했습니다.').should('exist');

        cy.url().should('include', '/admin/products');
    });


    it('이미지를 첨부를 안 했으면 에러 메시지가 출력되어야 한다', () => {

        //카테고리 선택
        cy.clickUntilLeaf(); // 0부터 시작해서 끝까지 자동 클릭

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
        cy.get('input[name="pname"]').type('테스트 상품', { force: true });
        cy.get('input[name="price"]').type('15000', { force: true });
        cy.get('input[name="sku"]').type('SKU123', { force: true });

        cy.get('input[name="receiver"]').should('not.exist'); // 등록폼에 불필요한 필드 방지 체크
        // 멀티 셀렉트 사이즈
        cy.get('[data-testid="multiSizeSelect"]').click({ force: true });

        cy.get('[data-testid="multiSelectValue"]').first().click({ force: true });
        cy.get('body').type('{esc}', {force: true}); // 드롭다운 닫기


        // 라디오 버튼 (판매중)
        cy.get('input[type="radio"][value="ONSALE"]').check({ force: true });

        cy.get('form[data-testid="product-form"]', { timeout: 10000 }).should('exist');

        cy.get('.ql-editor', { timeout: 10000 })
            .should('exist')
            .click({ force: true })
            .type('테스트 상세 설명입니다.', { force: true });

        cy.get('button[type="submit"]').click({ force: true });

        cy.contains('이미지는 한 개 이상 첨부해주세요.').should('exist');
    });
});
