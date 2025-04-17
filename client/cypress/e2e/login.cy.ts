describe('Login test', () => {

    context('Login test group', () => {

        it('Valid user', () => {
            cy.visit(`${Cypress.config("baseUrl")}/login`);
            cy.get('input[name="email"]').type('user1@aaa.com');
            cy.get('input[name="password"]').type('1111');
            cy.get('button[type="submit"]').click();
            cy.url().should('include', '/');
        });

        it('Invalid user', () => {
            cy.visit(`${Cypress.config("baseUrl")}/login`);
            cy.get('input[name="email"]').type('user1@aaa.com');
            cy.get('input[name="password"]').type('0000');
            cy.get('button[type="submit"]').click();
            cy.contains('아이디 또는 비밀번호가 맞지 않습니다.');
        });

        it('Not existed Email', () => {

            cy.visit(`${Cypress.config("baseUrl")}/login`);
            cy.get('input[name="email"]').type('noemail@aaa.com');
            cy.get('input[name="password"]').type('11111');
            cy.get('button[type="submit"]').click();
            cy.contains('존재하지 않는 계정입니다.');
        });
    });

    context('Logout', () => {

        it('Logout from main', () => {
            cy.login('user1@aaa.com', '1111');


            cy.get('img[aria-label="my-menu"]').should('be.visible').click();
            cy.get('button[aria-label="logout"]').click();
            cy.url().should('include', '/login');


        });

    });

});