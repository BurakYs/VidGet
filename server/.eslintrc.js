module.exports = {
    env: {
        node: true,
        es2021: true
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        logger: 'readonly'
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module'
    },
    ignorePatterns: ['dist/'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        indent: [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ]
    },
    overrides: [
        {
            files: ['src/interfaces/**/*.ts'],
            rules: {
                semi: 'off'
            }
        }
    ]
};