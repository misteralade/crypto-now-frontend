import React, {useEffect, useRef, useState} from "react";
import {useAuthQuery} from "../../queries/auth.query.ts";
import {ROUTES} from "../../util/constants.util.ts";
import {useNavigate} from "@tanstack/react-router";
import {toast} from "react-toastify";

export const useTwoFactorVerifyPage = () => {
  const navigate = useNavigate();
  const { verifyCodeMutation, resendTwoFactorCodeMutation } = useAuthQuery();
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  useEffect(() => {
    toast.success("Verification code sent to your email...")
  }, []);
  
  const handleSubmit = async (code: string) => {
    const { success } = await verifyCodeMutation.mutateAsync(code);
    
    if (success) {
      setTimeout(() => {
        navigate({ to: ROUTES.DASHBOARD });
      }, 3000)
    }
  }
  
  const handleCodeChange = (index: number, value: string) => {
    // Only allow single alphanumeric character
    if (value.length > 1) return
    
    const newCode = [...verificationCode]
    newCode[index] = value.toUpperCase()
    setVerificationCode(newCode)
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Auto-submit when last character is entered
    const fullCode = newCode.join("")
    if (fullCode.length === 6 && index === 5) {
      handleSubmit(fullCode)
    }
  }
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim().toUpperCase().slice(0, 8)
    const newCode = [...verificationCode]
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }
    
    setVerificationCode(newCode)
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex(code => code === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
    
    // Auto-submit if pasted code is 6 characters
    if (pastedData.length === 6) {
      handleSubmit(pastedData)
    }
  }

  const handleResendCode = async () => {
    await resendTwoFactorCodeMutation.mutateAsync();
  }
  
  return {
    // Values
    verificationCode,
    inputRefs,
    
    // Functions
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    verifyCodeMutation,
    handleResendCode,
  }
}