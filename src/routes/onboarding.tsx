import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { ROUTES } from "../util/constants.util.ts";
import { userServiceApi } from "../api/user.api.ts";
import { isAuthenticated } from "../util/auth-session.util.ts";

export const Route = createFileRoute('/onboarding')({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
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
      // Fail-safe: if the status check errors, let onboarding render :
      // worst case it's a redundant visit, not a blocked one.
    }
  },
})
