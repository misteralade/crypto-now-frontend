import { createFileRoute, redirect } from '@tanstack/react-router'
import TransactionDetailsPage from "../../../sections/transactions/details/TransactionDetailsPage.tsx";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../../util/constants.util.ts";
import { userServiceApi } from "../../../api/user.api.ts";

export const Route = createFileRoute('/dashboard/transactions/$id')({
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
  component: TransactionDetailsPage,
})
