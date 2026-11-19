import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "../../util/constants.util.ts";

export const Route = createFileRoute("/dashboard/kyc")({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.KYC });
  },
});
