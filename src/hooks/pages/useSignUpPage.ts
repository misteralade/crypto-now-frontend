import {type FormEvent, useState} from "react";
import {authServiceApi} from "../../api/auth.api.ts";
import {BASIC} from "../../config/index.config.ts";
import type {AuthResponse} from "../../types/response.payload.types.ts";

export const useSignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  
  const handleGoogleSignUp = () => {
    // Redirect to your backend OAuth endpoint
    window.location.href = `${BASIC.API_BASE_URL}/user/auth/google-signup`;
  };
  
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
      const {success, message}: AuthResponse = await authServiceApi.signup({
        email,
        password,
      });
      
      if (!success) {
        setError(message || 'Sign-Up failed. Please check your credentials.');
      } else {
        setOtpSent(true)
      }
      
    } catch (error: any) {
      setError(error.response.data.message || 'Sign-Up failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    // Values
    otpSent,
    error,
    email,
    password,
    showPassword,
    isLoading,
    
    // Functions
    handleSubmit,
    setEmail,
    setPassword,
    setShowPassword,
    handleGoogleSignUp,
  }
}