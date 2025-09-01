import { createFileRoute } from "@tanstack/react-router";
import OtpSent from "../sections/auth/forgot-password/OtpSent";
import { useState } from "react";
import ForgotPasswordPage from "../sections/auth/forgot-password";

export const Route = createFileRoute("/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const [step, setStep] = useState(0);
  return (
    <>
      {/* <OtpSent /> */}
      <ForgotPasswordPage />
    </>
  );
}
