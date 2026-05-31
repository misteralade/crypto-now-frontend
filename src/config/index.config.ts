export const BASIC = {
  API_BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
  NODE_ENV: import.meta.env.VITE_NODE_ENV || "development",
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || "",
  SENTRY_ENVIRONMENT: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.VITE_NODE_ENV || "development",
  SENTRY_TRACES_SAMPLE_RATE: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 1),
  SENTRY_PROFILES_SAMPLE_RATE: Number(import.meta.env.VITE_SENTRY_PROFILES_SAMPLE_RATE || 0.2),
}
