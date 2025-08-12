import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{js,ts}'],
        exclude: ['node_modules', 'dist', 'frontend'],
    },
});
//# sourceMappingURL=vitest.config.js.map