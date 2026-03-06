import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        executablePath: '/usr/bin/chromium',
      },
    },
  ],
});
