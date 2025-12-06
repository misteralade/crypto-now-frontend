import {useState} from "react";
import {authServiceApi} from "../../api/auth.api.ts";
import {emailValidation} from "../../util/constants.regex.util.ts";
import type {AuthResponse} from "../../types/response.payload.types.ts";
import {toast} from "react-toastify";

export const useForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const {forgotPassword} = authServiceApi;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const validateEmail = (password: string): boolean => {
    return emailValidation.test(password);
  }
  
  const handleResetPassword = async () => {
    setIsLoading(true);
    setError("");
    
    if (!email) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    try {
      const {success, message}: AuthResponse = await forgotPassword(email);
      
      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
      
    } catch (error: any) {
      setError(error.message || 'Request Failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    // Values
    email,
    isLoading,
    error,
    
    
    // Functions
    handleResetPassword,
    validateEmail,
    setEmail,
  };
}