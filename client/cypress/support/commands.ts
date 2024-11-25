Cypress.Commands.add('login', (email:string, password:string) => {
    cy.visit('http://localhost:3000/login'); // 로그인 페이지에 접속합니다.

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('form').submit();
});
