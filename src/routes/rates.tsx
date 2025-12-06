import { createFileRoute } from '@tanstack/react-router'
import RatePage from "../pages/RatePage.tsx";

export const Route = createFileRoute('/rates')({
  component: RatePage,
})
