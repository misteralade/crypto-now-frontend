import { initializeSentry } from "./config/sentry.ts";

initializeSentry();

void import("./app.tsx");
