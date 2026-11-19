import {createFileRoute, redirect} from '@tanstack/react-router'
import { ROUTES } from "../../util/constants.util.ts";
import { isAuthenticated } from "../../util/auth-session.util.ts";

export type ProfileSection = "personal" | "bank" | "security";

export const Route = createFileRoute('/dashboard/profile')({
  validateSearch: (search: Record<string, unknown>) => {
    const valid: ProfileSection[] = ["personal", "bank", "security"];
    const section = search.section as string | undefined;
    return {
      section: (section && valid.includes(section as ProfileSection) ? section : undefined) as ProfileSection | undefined,
    };
  },
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: ROUTES.SIGNIN,
      });
    }
  },
})
