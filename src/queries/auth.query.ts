import { useMutation } from "@tanstack/react-query";
// import type {LoginRequestSchema} from "../schema/auth.schema.ts";
import {authServiceApi} from "../api/auth.api.ts";
import {useState} from "react";
import {toast} from "react-toastify";
import {ROUTES} from "../util/constants.ts";

export const useAuthQuery = () => {
  const [loggingInLoading, setLoggingInLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      setLoggingInLoading(true);
      return await authServiceApi.login(data);
    },

    onError: async (error: Error) => {
      setLoggingInLoading(false);
      toast.error(error.message);
    },

    onSuccess: async (result) => {
      setLoggingInLoading(false);
      if (result?.success) {
        toast.success(result?.message);
        setTimeout(() => {
          window.location.href = ROUTES.HOMEPAGE;
        }, 3000);
      } else {
        toast.error(result?.message || "Login failed");
      }
    }
  })

  return {
    // Values
    loggingInLoading,

    // Functions
    loginMutation,
  };
};
