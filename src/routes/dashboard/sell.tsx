import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/sell")({
  validateSearch: (search: Record<string, unknown>) => ({
    option: search.option as string | undefined,
    sessionId: search.sessionId as string | undefined,
    resume: search.resume as string | boolean | undefined,
  }),
});
