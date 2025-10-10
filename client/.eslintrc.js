module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['unused-imports', 'simple-import-sort'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
  },
};
