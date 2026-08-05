import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../util/constants.util.ts";
import {userServiceApi} from "../../api/user.api.ts";

export const Route = createFileRoute('/oauth/success')({
  beforeLoad: async ({ search }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { token } = search

    if (!token) {
      // If no token, redirect to login (optional)
      throw redirect({
        to: '/sign-up',
      })
    }

    // Save token to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token)

    try {
      const { success, data } = await userServiceApi.getOnboardingStatus()
      if (success && data?.isComplete) {
        throw redirect({ to: ROUTES.DASHBOARD })
      }
      throw redirect({ to: ROUTES.ONBOARDING })
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      // Fail-safe: if the status check errors, default to onboarding —
      // worst case an already-onboarded user sees it once and it
      // self-resolves via onboarding.tsx's own isComplete check.
      throw redirect({ to: ROUTES.ONBOARDING })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Authenticating...</div>
}
