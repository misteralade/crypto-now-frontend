"use client";

import {createFileRoute} from '@tanstack/react-router'
import {BASIC} from "../config/index.config.ts";

export const Route = createFileRoute('/verify-account')({
  beforeLoad: ({ search }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { token } = search
    window.location.href = `${BASIC.API_BASE_URL}/user/auth/activate?token=${token}`;
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Activating your account...</p>
    </div>
  )
}
