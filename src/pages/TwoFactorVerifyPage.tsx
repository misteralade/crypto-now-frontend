import {Fragment} from "react";
import {useTwoFactorVerifyPage} from "../hooks/pages/useTwoFactorVerifyPage.ts";
import Navbar from "../components/global/navbar/Navbar.tsx";
import AuthBg from "../assets/backgrounds/auth-bg.webp";

const TwoFactorVerifyPage = () => {
  const {
    // Values
    verificationCode,
    inputRefs,
    
    // Functions
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    verifyCodeMutation,
    handleResendCode,
  } = useTwoFactorVerifyPage();
  
  return (
    <Fragment>
      <Navbar />
      
      <main className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-white">
          <div className="w-full max-w-md space-y-8">
            {/* Verification Code Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Enter verification code
              </label>
              <div className="flex gap-2 md:gap-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={verifyCodeMutation.isPending}
                    className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1a1f5c] focus:ring-2 focus:ring-[#1a1f5c]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                ))}
              </div>
            </div>
            
            {/* Loading State */}
            {verifyCodeMutation.isPending && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying...</span>
              </div>
            )}

            {/*Resend Code Link*/}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:cursor-pointer"
                onClick={handleResendCode}
              >
                Resend code
              </button>
            </div>
            
            {/* Back to Sign In */}
            <div className="text-center pt-4">
              <a
                href="/sign-in"
                className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                ← Back to sign in
              </a>
            </div>
          </div>
        </div>
        
        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={AuthBg}
            alt={AuthBg}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f5c]/80 to-[#1a1f5c]/60"></div>
        </div>
      </main>
    </Fragment>
  )
}

export default TwoFactorVerifyPage;
