import {useNavigate, useSearch} from '@tanstack/react-router'
import {useState} from "react";
import {authServiceApi} from "../../api/auth.api.ts";
import { toast } from 'react-toastify';
import {useMutation} from "@tanstack/react-query";

export const useResetPasswordPage = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { token } = useSearch({ from: '/reset-password' }) // use your actual route path/id
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      toast.loading("Processing...");
      setIsLoading(true);
      return authServiceApi.confirmPasswordRequest(data.token, data.newPassword, data.confirmPassword);
    },
    onSuccess: async (data: Record<string, any>) => {
      setIsLoading(false);
      toast.dismiss();
      if (data?.response?.data?.message) {
        setError(data?.response?.data?.message);
        toast.success(data?.response?.data?.message);
      }
      setTimeout(() => {
        setIsPasswordChanged(true);
        navigate({to: '/sign-in'});
      }, 5000)
    },
    onError: async (data: Record<string, any>) => {
      setIsLoading(false);
      toast.dismiss();
      if (data?.response?.data?.message) {
        setError(data?.response?.data?.message);
        toast.error(data?.response?.data?.message);
      } else {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
    }
  })
  
  const handlePasswordChange = (value: string)=> {
    setNewPassword(value)
  }
  
  const handleConfirmPasswordChange = (value: string)=> {
    if (value !== newPassword) {
      setIsPasswordMatch(false)
    } else {
      setIsPasswordMatch(true)
    }
    
    setConfirmPassword(value)
  }
  
  const handleNewPassword = async () => {
    updatePasswordMutation.mutate({ token, newPassword, confirmPassword });
  }
  
  const navigateToLogin = () => {
    navigate({ to: '/sign-in' })
  }
  
  return {
    // Values
    isPasswordChanged,
    newPassword,
    confirmPassword,
    isPasswordValid,
    isPasswordMatch,
    isLoading,
    error,
    
    
    // Functions
    setIsPasswordValid,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNewPassword,
    navigateToLogin,
  }
}