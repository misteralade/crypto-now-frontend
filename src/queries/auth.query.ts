import { useMutation } from "@tanstack/react-query";
import {authServiceApi} from "../api/auth.api.ts";
import {useState} from "react";
import {toast} from "react-toastify";
import {ROUTES} from "../util/constants.util.ts";
import type {AxiosServerError} from "../types/response.payload.types.ts";

export const useAuthQuery = () => {
  const [loggingInLoading, setLoggingInLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      toast.loading("Logging in...");
      setLoggingInLoading(true);
      return await authServiceApi.login(data);
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      toast.success("Login successfully.");
      setLoggingInLoading(false);
      if (success) {
        toast.success(message);
        setTimeout(() => {
          window.location.href = ROUTES.HOMEPAGE;
        }, 3000);
      } else {
        toast.error(message || "Login failed");
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      setLoggingInLoading(false);
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to initiate password change'
      toast.error(message);
    },
  });
  
  const userRequestPasswordChangeMutation = useMutation({
    mutationFn: async () => {
      toast.loading(`Request password update...`);
      return await authServiceApi.changePassword();
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
      } else {
        toast.error(message || "Failed to change password");
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to initiate password change'
      toast.error(message);
    },
  })

  return {
    // Values
    loggingInLoading,

    // Functions
    loginMutation,
    userRequestPasswordChangeMutation,
  };
};
