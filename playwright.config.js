import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 45_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4321', channel: 'chrome' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1366, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
