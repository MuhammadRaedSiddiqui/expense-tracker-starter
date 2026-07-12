import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/__tests__/**/*.{test,spec}.{js,ts}'],
    testTimeout: 10000,
    clearMocks: true,
    restoreMocks: true,
  },
})
