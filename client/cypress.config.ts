import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // 기본 URL 설정
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: '**/*.cy.ts',
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
