import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/setupTests.tsx'],
    include: ['./src/**/*.test.tsx'],
    coverage: {
      include: ['src'],
      statements: 100,
      functions: 100,
      branches: 100,
      lines: 100,
    },
  },
});
