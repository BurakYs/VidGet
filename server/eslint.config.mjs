import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    ...ts.configs.recommended,
    {
        languageOptions: {
            globals: {
                logger: 'readonly'
            }
        }
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        }
    },
    {
        ignores: ['dist/']
    }
];