import {createFileRoute, redirect} from '@tanstack/react-router'
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../util/constants.util.ts";
import ProfilePage from "../../pages/ProfilePage.tsx";
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

    // Ping user to verify access token is valid
    try {
      const { success } = await userServiceApi.pingUser();
      if (!success) {
        // Token is invalid, remove it and redirect to sign in
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        throw redirect({
          to: ROUTES.SIGNIN,
        });
      }
    } catch (error) {
      // If ping fails (network error, invalid token, etc.), remove token and redirect
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      throw redirect({
        to: ROUTES.SIGNIN,
      });
    }
  },
  component: ProfilePage,
})
