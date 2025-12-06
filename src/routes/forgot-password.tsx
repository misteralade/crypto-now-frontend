import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "../sections/auth/forgot-password";

export const Route = createFileRoute("/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Fragment>
      <ForgotPasswordPage />
    </Fragment>
  );
}
