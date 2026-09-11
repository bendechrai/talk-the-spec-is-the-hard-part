import { defineConfig } from "@playwright/test";

const PORT = process.env.PORT ?? "3100";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: "npm run e2e:prepare && npm run dev",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    env: {
      PORT,
      DATABASE_URL: "./data.e2e.db",
    },
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
