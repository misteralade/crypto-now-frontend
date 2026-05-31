import * as Sentry from "@sentry/react";
import { BASIC } from "./index.config.ts";

let initialized = false;

function clampRate(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
}

function getTracePropagationTargets(): Array<string | RegExp> {
  const targets: Array<string | RegExp> = [BASIC.API_BASE_URL];

  try {
    const parsed = new URL(BASIC.API_BASE_URL);
    targets.push(parsed.origin);
  } catch {
    // Relative API base URLs do not need an extra origin target.
  }

  return targets;
}

export function initializeSentry(): boolean {
  if (initialized || !BASIC.SENTRY_DSN) {
    return initialized;
  }

  Sentry.init({
    dsn: BASIC.SENTRY_DSN,
    environment: BASIC.SENTRY_ENVIRONMENT,
    tracesSampleRate: clampRate(BASIC.SENTRY_TRACES_SAMPLE_RATE),
    profilesSampleRate: clampRate(BASIC.SENTRY_PROFILES_SAMPLE_RATE),
    debug: false,
    sendDefaultPii: true,
    integrations: [Sentry.browserTracingIntegration()],
    tracePropagationTargets: getTracePropagationTargets(),
  });

  initialized = true;
  return true;
}
