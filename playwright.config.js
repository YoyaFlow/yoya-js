import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        executablePath: '/usr/bin/chromium',
        headless: false,
      },
    },
  ],
  // 注释掉 webServer，因为我们已经有服务器在运行
  // webServer: {
  //   command: 'npm run dev',
  //   port: 3002,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: true,
  // },
  reporter: 'list',
});
