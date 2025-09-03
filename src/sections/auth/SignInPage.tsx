import { useState } from "react";
import CustomButton from "../../components/global/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { Link } from "@tanstack/react-router";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("jonas@gmail.com");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  return (
    <AuthLayout layoutType={2}>
      {/* Form Header */}
      <div className="mb-10">
        <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
          Sign in
        </h1>
        <p className="md:text-[18px] text-base md:leading-[24px] text-[#454745] font-normal">
          Please login to continue to your account.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-[14px] font-medium text-[#374151] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
            placeholder="jonas@gmail.com"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[52px] px-4 py-3 pr-12 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-200"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mt-3">
            <a
              href="/forgot-password"
              className="text-[14px] text-[#6B7280] hover:text-[#1E1B4B] underline transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* Keep me logged in checkbox */}
        <div className="flex items-center">
          <input
            id="keep-logged-in"
            name="keep-logged-in"
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="h-4 w-4 text-[#3B82F6] focus:ring-[#3B82F6] border-[#D1D5DB] rounded"
          />
          <label
            htmlFor="keep-logged-in"
            className="ml-3 text-[14px] text-[#374151]"
          >
            Keep me logged in for 7 days
          </label>
        </div>

        {/* Sign In Button */}
        <div className="pt-2">
          <CustomButton className="w-full" buttonText="Sign in" />
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-[14px]">
            <span className="px-4 bg-white text-[#6B7280]">or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          className="w-full h-[52px] flex items-center justify-center px-4 py-3 border border-[#E5E7EB] rounded-[26px] shadow-sm bg-white text-[16px] font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Create Account Link */}
        <p className="text-center text-[14px] leading-[20px] text-[#6B7280] pt-2">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-[#1E1B4B] hover:text-[#2D2A5A] underline transition-colors duration-200"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
