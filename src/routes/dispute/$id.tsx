import { createFileRoute } from '@tanstack/react-router'
import ViewDisputePage from "../../sections/dispute/details/ViewDisputePage.tsx";

export const Route = createFileRoute('/dispute/$id')({
  component: ViewDisputePage,
})
