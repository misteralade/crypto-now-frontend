import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BASIC } from "../../config/index.config.ts";
import { ROUTES } from "../../util/constants.util.ts";
import type {AuthenticationRequestType} from "../../schemas/user.schema.ts";
import {useAuthQuery} from "../../queries/auth.query.ts";
import type {AuthRequestSchema} from "../../types/request.api.types.ts";
import {useDispatch} from "react-redux";
import {setSignInEmail} from "../../redux/user.slice.ts";

export const useSignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userSignInMutation } = useAuthQuery();

  const [showPassword, setShowPassword] = useState(false);

  const signInInitialState:AuthenticationRequestType = {
    email: "",
    password: "",
    rememberMe: false,
  }

  const handleSubmit = async (values: AuthenticationRequestType) => {
    dispatch(setSignInEmail(values.email));
    const payload:AuthRequestSchema = {
      email: values.email,
      password: values.password,
      keepLoggedIn: values.rememberMe,
    }

    const { success, data } = await userSignInMutation.mutateAsync(payload);

    if (success) {
      navigate({ to: data ? ROUTES.TWO_FACTOR_VERIFY : ROUTES.DASHBOARD });
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to your backend OAuth endpoint
    window.location.href = `${BASIC.API_BASE_URL}/user/auth/google-signup`;
  };

  return {
    // Values
    showPassword,
    signInInitialState,

    // Functions
    handleSubmit,
    setShowPassword,
    handleGoogleSignIn,
  };
};
