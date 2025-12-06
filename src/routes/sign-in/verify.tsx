import { createFileRoute } from '@tanstack/react-router'
import TwoFactorVerifyPage from "../../pages/TwoFactorVerifyPage.tsx";

export const Route = createFileRoute('/sign-in/verify')({
  component: TwoFactorVerifyPage,
})
