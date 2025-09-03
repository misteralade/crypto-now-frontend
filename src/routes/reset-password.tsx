import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordPage from "../sections/auth/forgot-password/ResetPasswordPage.tsx";


export const Route = createFileRoute("/reset-password")({
    component: ResetPasswordPage,
});

