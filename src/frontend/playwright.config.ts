import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e-results',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { outputFolder: 'e2e-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    /**
     * Start Vite dev server with mock backend enabled.
     * VITE_USE_MOCK=true makes useBackend() return the in-memory mock
     * instead of trying to connect to an ICP canister.
     */
    command: 'VITE_USE_MOCK=true pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_USE_MOCK: 'true',
    },
  },
});
