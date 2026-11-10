import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'allure-results', 'allure-report'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
  {
    files: ['test/specs/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
);
