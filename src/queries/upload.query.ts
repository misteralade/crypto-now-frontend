import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {userServiceApi} from "../api/user.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";
import {extractErrorMessage} from "../util/index.util.ts";
import {transactionServiceApi} from "../api/transaction.api.ts";

export const useUploadQuery = () => {
  const uploadProfilePictureMutation = useMutation({
    mutationKey: [QUERY_KEYS.USER.UPLOAD_PROFILE_PICTURE],
    mutationFn: async (formData: FormData) => {
      const { url } = await userServiceApi.uploadProfilePicture(formData);
      return url;
    },
    onError: (error: AxiosServerError) => {
      const message = extractErrorMessage(error) || 'Failed to upload file';
      toast.error(message);
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { url } = await transactionServiceApi.uploadDisputeAttachment(formData);
      return url;
    },
    onError: ( error: AxiosServerError ) => {
      const message = extractErrorMessage(error) || "Failed to upload file. Please try again."
      toast.error(message);
    },
  });
  
  return {
    uploadFileMutation,
    uploadProfilePictureMutation,
  }
}