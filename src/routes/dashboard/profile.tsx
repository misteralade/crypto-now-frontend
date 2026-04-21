import {createFileRoute, redirect} from '@tanstack/react-router'
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../util/constants.util.ts";
import { userServiceApi } from "../../api/user.api.ts";

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
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw redirect({
        to: ROUTES.SIGNIN,
      });
    }
  },
})
