import {createFileRoute, redirect} from '@tanstack/react-router'
import {toast} from "react-toastify";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../util/constants.util.ts";

export const Route = createFileRoute('/activation-result')({
  beforeLoad: ({ search }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { message, success, token } = search

    // Freshly verified: a token means the user is now logged in — send
    // them straight to onboarding, same as the OAuth success flow does.
    if (success && token) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token)
      throw redirect({
        to: ROUTES.ONBOARDING,
      })
    }

    // Already-verified (no token issued) or failed — unchanged behavior.
    if (success) {
      toast.success(decodeURIComponent(message), { toastId: "activation-result-toast" })
    } else {
      toast.error(decodeURIComponent(message), { toastId: "activation-result-toast" })
    }

    throw redirect({
      to: ROUTES.SIGNIN,
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/activation-result"!</div>
}
