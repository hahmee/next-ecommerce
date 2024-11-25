// 'My App'이라는 테스트 스위트를 정의합니다.
describe('E-COMMERCE', () => {

  // 'Login'이라는 테스트 그룹을 정의합니다. 이 테스트 그룹은 로그인 기능과 관련된 테스트 케이스들을 묶어줍니다.
  context('Login test group', () => {

    // 'Valid user'라는 테스트 케이스를 정의합니다. 이 테스트 케이스는 유효한 사용자 정보로 로그인하는 것을 테스트합니다.
    it('Valid user', () => {
      // 테스트할 내용을 작성합니다.
      cy.visit("http://localhost:3000/login"); // 로그인 페이지에 접속합니다.
      cy.get('input[name="email"]').type('user1@aaa.com');
      cy.get('input[name="password"]').type('1111');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/'); // 로그인이 성공하면 메인 페이지로 이동합니다.
    });

    // // 'Invalid user'라는 테스트 케이스를 정의합니다. 이 테스트 케이스는 유효하지 않은 사용자 정보로 로그인하는 것을 테스트합니다.
    it('Invalid user', () => {
      // 테스트할 내용을 작성합니다.
      cy.visit('http://localhost:3000/login'); // 로그인 페이지에 접속합니다.
      cy.get('input[name="email"]').type('user1@aaa.com'); // 아이디 입력창에 'wrong'이라고 입력합니다.
      cy.get('input[name="password"]').type('0000'); // 비밀번호 입력창에 '4321'이라고 입력합니다.
      cy.get('button[type="submit"]').click(); // 로그인 버튼을 클릭합니다.
      cy.contains('아이디 또는 비밀번호가 맞지 않습니다.'); // 로그인이 실패하면 에러 메시지를 표시합니다.
    });

    it('Not existed Email', () => {
      // 테스트할 내용을 작성합니다.
      cy.visit('http://localhost:3000/login'); // 로그인 페이지에 접속합니다.
      cy.get('input[name="email"]').type('noemail@aaa.com'); // 아이디 입력창에 'wrong'이라고 입력합니다.
      cy.get('input[name="password"]').type('11111'); // 비밀번호 입력창에 '4321'이라고 입력합니다.
      cy.get('button[type="submit"]').click(); // 로그인 버튼을 클릭합니다.
      cy.contains('존재하지 않는 계정입니다.'); // 로그인이 실패하면 에러 메시지를 표시합니다.
    });
  });
  //
  // 'Logout'이라는 테스트 그룹을 정의합니다. 이 테스트 그룹은 로그아웃 기능과 관련된 테스트 케이스들을 묶어줍니다.
  context('Logout', () => {

    // 'Logout from main'라는 테스트 케이스를 정의합니다. 이 테스트 케이스는 메인 페이지에서 로그아웃하는 것을 테스트합니다.
    it('Logout from main', () => {
      // 테스트할 내용을 작성합니다.
      cy.login('user1@aaa.com', '1111'); // cy.login()은 커스텀 커맨드로, 로그인을 수행하는 함수입니다.
      cy.visit('http://localhost:3000'); // 메인 페이지에 접속합니다.
      cy.get('img[aria-label="my-menu"]').click(); //메뉴 클릭
      cy.get('#account-menu').should('be.visible');//메뉴가 열렸는지 확인
      cy.get('button[aria-label="logout"]').click(); // 로그아웃 버튼을 클릭합니다.
      cy.url().should('include', '/login'); // 로그아웃이 성공하면 로그인 페이지로 이동합니다.
    });

  });

});