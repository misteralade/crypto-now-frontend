import {createFileRoute, redirect} from '@tanstack/react-router'
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../util/constants.util.ts";
import ProfilePage from "../../pages/ProfilePage.tsx";

export const Route = createFileRoute('/dashboard/profile')({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw redirect({
        to: ROUTES.SIGNIN,
      });
    }
  },
  component: ProfilePage,
})
