import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Enable globals (describe, test, expect without imports)
    globals: true,

    // Use jsdom for DOM/browser API mocking
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./src/test/setup.js'],

    // Include/exclude patterns
    include: ['**/*.{test,spec}.{js,jsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/server/**'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.{test,spec}.{js,jsx}', 'src/main.jsx']
    },

    // Timeouts
    testTimeout: 10000,

    // Clear mocks between tests
    clearMocks: true,
    restoreMocks: true
  }
})
