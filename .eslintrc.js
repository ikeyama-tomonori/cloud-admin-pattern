module.exports = {
    settings: {
        react: { version: 'detect' },
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.base.json'],
    },
    plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint',
        'import',
        'jest-dom',
        'testing-library',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/jsx-runtime',
        'airbnb-typescript',
        'prettier',
    ],
    overrides: [
        {
            files: [
                '**/__tests__/**/*.+(ts|tsx|js)',
                '**/?(*.)+(spec|test).+(ts|tsx|js)',
            ],
            extends: [
                'plugin:jest-dom/recommended',
                'plugin:testing-library/react',
            ],
        },
    ],
    ignorePatterns: [
        '.eslintrc.js',
        'vite.config.ts',
        'vitest.setup.ts',
        'vitest.config.ts ',
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-key': [
            'error',
            { checkFragmentShorthand: true, warnOnDuplicates: true },
        ],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    '**/__tests__/**/*.+(ts|tsx|js)',
                    '**/?(*.)+(spec|test).+(ts|tsx|js)',
                ],
            },
        ],
        'import/order': 'error',
    },
};
