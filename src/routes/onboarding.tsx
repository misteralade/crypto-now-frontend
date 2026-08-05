import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";
import { userServiceApi } from "../api/user.api.ts";

export const Route = createFileRoute('/onboarding')({
  beforeLoad: async () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw redirect({ to: ROUTES.SIGNIN });
    }

    try {
      const { success, data } = await userServiceApi.getOnboardingStatus();
      if (success && data?.isComplete) {
        throw redirect({ to: ROUTES.DASHBOARD });
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      // Fail-safe: if the status check errors, let onboarding render —
      // worst case it's a redundant visit, not a blocked one.
    }
  },
})
