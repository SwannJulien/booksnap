import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // happy-dom, not a real browser: no Playwright, no Chromium download.
    // What it cannot do is documented in test/README.md — read it before
    // assuming a green suite means the UI works.
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.ts'],
  },
});
