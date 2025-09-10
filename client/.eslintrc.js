module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: { browser: true, node: true, es2021: true },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json', './cypress/tsconfig.json'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'react/function-component-definition': [
      'warn',
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    ],
    'react/require-default-props': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
      },
    },
    {
      files: [
        '**/*.test.*',
        '**/*.spec.*',
        'jest.*',
        '**/*.config.*',
        '**/next-env.d.ts',
        '**/next.config.*',
        '**/postcss.config.*',
        '**/tailwind.config.*',
      ],
      rules: { 'import/no-extraneous-dependencies': 'off' },
    },
    {
      files: ['cypress/**/*.{ts,tsx}', 'cypress.config.*'],
      extends: ['plugin:cypress/recommended'],
      env: { 'cypress/globals': true },
      parserOptions: {
        project: ['./cypress/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: { 'import/no-extraneous-dependencies': 'off' },
    },
  ],
};
