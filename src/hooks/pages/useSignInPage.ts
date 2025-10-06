import {type FormEvent, useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import type {AuthResponse} from "../../types/response.payload.types.ts";
import {authServiceApi} from "../../api/auth.api.ts";
import { BASIC } from "../../config/index.config.ts";

export const useSignInPage = () => {
  const navigate = useNavigate()
  
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
      const {success, message}: AuthResponse = await authServiceApi.login({
        email,
        password,
        keepLoggedIn
      });
      
      if (!success) {
        setError(message || 'Login failed. Please check your credentials.');
      } else{
        navigate({to: '/dashboard'});
      }
      
    } catch (error: any) {
      setError(error.response.data.message || 'Login failed. Please check your credentials.');
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
  }
}