/// <reference types="vitest" />

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        reporters: ['verbose', 'vitest-sonar-reporter'],
        outputFile: {
            'vitest-sonar-reporter': 'report/sonar-report.xml',
        },
        coverage: {
            all: true,
            src: ['./packages'],
            exclude: [
                '**/__generated__',
                '**/cdk.out',
                '**/vite*.ts',
                '**/?(*.)+(spec|test).+(ts|tsx|js)',
            ],
            reporter: ['text', 'html', 'lcov'],
            statements: 0,
            branches: 0,
            functions: 0,
            lines: 0,
        },
    },
});
