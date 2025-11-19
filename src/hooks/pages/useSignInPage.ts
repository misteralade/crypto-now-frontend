import { type FormEvent, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authServiceApi } from "../../api/auth.api.ts";
import { BASIC } from "../../config/index.config.ts";
import {ROUTES} from "../../util/constants.util.ts";

export const useSignInPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const { success, message, data } = await authServiceApi.login({
        email,
        password,
        keepLoggedIn,
      });

      if (!success) {
        setError(message || "Login failed. Please check your credentials.");
      } else {
        navigate({ to: data ? ROUTES.TWO_FACTOR_VERIFY : ROUTES.DASHBOARD });
      }
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "";
    
      const normalizedMsg =
        apiMessage && !/schema validation/i.test(apiMessage)
          ? apiMessage
          : "Login failed. Please check your email and password.";
    
      setError(normalizedMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to your backend OAuth endpoint
    window.location.href = `${BASIC.API_BASE_URL}/user/auth/google-signup`;
  };

  return {
    // Values
    error,
    email,
    password,
    showPassword,
    keepLoggedIn,
    isLoading,

    // Functions
    handleSubmit,
    setEmail,
    setPassword,
    setShowPassword,
    setKeepLoggedIn,
    handleGoogleSignIn,
  };
};
