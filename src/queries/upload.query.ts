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
      const file:any = formData.get("file");
      toast.loading(`Upload picture: ${file["name"]}`);
      const { url } = await userServiceApi.uploadProfilePicture(formData);
      return url;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(`Upload picture successfully uploaded`);
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || 'Failed to upload file';
      toast.error(message);
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const toastId = toast.loading("Uploading file...");
      try {
        const { url } = await transactionServiceApi.uploadDisputeAttachment(formData);
        toast.dismiss(toastId);
        toast.success("File uploaded successfully");
        return url;
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to upload file");
        throw error;
      }
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(`Upload picture successfully uploaded`);
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || "Failed to upload file. Please try again."
      toast.error(message);
    },
  });
  
  return {
    uploadFileMutation,
    uploadProfilePictureMutation,
  }
}