import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        executablePath: '/usr/bin/chromium',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3001,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
  reporter: 'list',
  timeout: 30000,
});
