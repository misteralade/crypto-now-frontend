import {createFileRoute, redirect} from '@tanstack/react-router'
import {toast} from "react-toastify";
import {ROUTES} from "../util/constants.util.ts";

export const Route = createFileRoute('/activation-result')({
  beforeLoad: ({ search }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { message, success } = search
    
    // Save token to localStorage
    if (success) {
      toast.success(decodeURIComponent(message))
    } else {
      toast.error(decodeURIComponent(message))
    }
    
    // Redirect immediately to /dashboard
    throw redirect({
      to: ROUTES.SIGNIN,
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/activation-result"!</div>
}
