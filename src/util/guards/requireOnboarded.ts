import { isRedirect, redirect } from "@tanstack/react-router";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../constants.util.ts";
import { userServiceApi } from "../../api/user.api.ts";

// Shared beforeLoad guard: requires a token, and redirects to /onboarding
// if the user hasn't completed it yet. Used by route shells (runs outside
// React, so it can't use hooks) — dashboard.tsx today; more protected
// top-level routes can call this the same way later.
export async function requireOnboarded(): Promise<void> {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  if (!accessToken) {
    throw redirect({ to: ROUTES.SIGNIN });
  }

  try {
    const { success, data } = await userServiceApi.getOnboardingStatus();
    if (success && data && !data.isComplete) {
      throw redirect({ to: ROUTES.ONBOARDING });
    }
  } catch (error) {
    // Redirects are thrown as control-flow signals by TanStack Router —
    // never swallow them here.
    if (isRedirect(error)) {
      throw error;
    }
    // Fail-safe: if the status check itself errors (network blip, etc.),
    // don't block navigation on a broken check — let the user through.
  }
}
