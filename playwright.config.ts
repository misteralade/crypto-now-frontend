// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
    storageState: "./agents/auth/frontend.json", // reuse auth automatically
  },
  reporter: process.env.AGENTS
    ? [["line"]] // minimal for agents
    : [["html"]], // rich for your browser
});
