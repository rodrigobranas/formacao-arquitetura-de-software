import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    browserName: "chromium"
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
