import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {transactionServiceApi} from "../api/transaction.api.ts";
import type {AxiosServerError} from "../types/response.payload.types.ts";

export const useUploadQuery = () => {
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
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(data.error.message)
    },
  });
  
  return {
    uploadFileMutation,
  }
}