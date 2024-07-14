import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}']
  },
  {
    ignores: ['dist/']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'indent': ['error', 2],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never']
    }
  },
  {
    files: ['**/interfaces/**'],
    rules: {
      'semi': 'off'
    }
  }
];