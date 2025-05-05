// cypress/support/commands.d.ts
declare namespace Cypress {
    interface Chainable {
        /**
         * 커스텀 로그인 명령어
         * @param email 로그인 이메일
         * @param password 로그인 비밀번호
         */
        login(email: string, password: string): Chainable<void>;

        /**
         * 최하위 카테고리까지 자동 클릭
         * @param level 시작 레벨 (기본 0)
         */
        clickUntilLeaf(level?: number): Chainable<void>;
    }
}
