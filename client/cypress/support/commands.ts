Cypress.Commands.add('login', (email: string, password: string) => {

    cy.visit(`${Cypress.config("baseUrl")}/login`); // 로그인 페이지에 접속합니다.

    cy.get('input[name="email"]').clear().type(email);
    cy.get('input[name="password"]').clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');  // 메인 페이지로 리디렉션되었는지 확인  // cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.wait(1000); // 쿠키가 설정되기 전에 기다리기

    // 최대 10초 기다리며 쿠키 확인
    cy.getCookie('member', { timeout: 10000 }).should('exist').then((cookie:any) => {
        // 쿠키가 존재하면, JSON으로 파싱한 후 email이 포함되어 있는지 확인
        // URL-decoding the cookie value
        console.log('cookie.value', cookie.value);
        const decodedCookie = decodeURIComponent(cookie.value);

        // Parse the decoded cookie value to JSON
        const cookieValue = JSON.parse(decodedCookie);

        // Verify the email property
        expect(cookieValue).to.have.property('email', email);

    });


});
