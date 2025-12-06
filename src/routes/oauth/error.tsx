import { createFileRoute, redirect } from '@tanstack/react-router'
import {toast} from "react-toastify";

export const Route = createFileRoute('/oauth/error')({
  beforeLoad: ({ search }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { message } = search
    
    if (message) {
      // Save token to localStorage
      toast.error(message)
      
      // Redirect immediately to /dashboard
      throw redirect({
        to: '/sign-up',
      })
    } else {
      // If no token, redirect to login (optional)
      throw redirect({
        to: '/sign-up',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Authenticating...</div>
}
