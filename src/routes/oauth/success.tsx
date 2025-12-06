import { createFileRoute, redirect } from '@tanstack/react-router'
import {LOCAL_STORAGE_KEYS} from "../../util/constants.util.ts";

export const Route = createFileRoute('/oauth/success')({
  beforeLoad: ({ search }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { token } = search
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token)
      
      // Redirect immediately to /dashboard
      throw redirect({
        to: '/dashboard',
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
