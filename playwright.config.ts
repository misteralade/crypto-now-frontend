// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: process.env.AGENTS
    ? [["line"]] // minimal for agents
    : [["html"]], // rich for your browser

  use: {
    baseURL: "http://localhost:5173",
    storageState: "./agents/auth/frontend.json", // reuse auth automatically
  },
});
