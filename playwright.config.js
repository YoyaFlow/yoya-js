import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        channel: 'chromium',
        executablePath: '/usr/bin/chromium',
      },
    },
  ],
});
