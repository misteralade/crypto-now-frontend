import { useState } from "react";
import {BASIC} from "../../config/index.config.ts";
import { useDispatch } from "react-redux";
import { setCreateUser } from "../../redux/user.slice.ts";
import type {CreateUserRequestType} from "../../schemas/user.schema.ts";
import {useAuthQuery} from "../../queries/auth.query.ts";
import {useNavigate} from "@tanstack/react-router";
import {ROUTES} from "../../util/constants.util.ts";
import {toast} from "react-toastify";

export const useSignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userCreateAccountMutation } = useAuthQuery();
  
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, ] = useState(false);
  
  const handleGoogleSignUp = () => {
    // Redirect to your backend OAuth endpoint
    window.location.href = `${BASIC.API_BASE_URL}/user/auth/google-signup`;
  };
  
  const handleSubmit = async (data: CreateUserRequestType) => {
    dispatch(setCreateUser(data));
    const { success } = await userCreateAccountMutation.mutateAsync();
    if (success) {
      toast.info(`Account activation link sent to your email. If you don't see it in your inbox, please check your spam folder.`)
      setTimeout(() => {
        navigate({ to: ROUTES.SIGNIN })
      })
    }
  }
  
  return {
    // Values
    otpSent,
    showPassword,
    
    // Functions
    handleSubmit,
    setShowPassword,
    handleGoogleSignUp,
  }
}