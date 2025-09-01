import { useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout";
import CustomButton from "../../../components/global/Button";
import ArrowIcon from "../../../assets/icons/fluent-arrow.svg";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("jonas@gmail.com");

  const handleResetPassword = (e: any) => {
    e.preventDefault();
    // Handle reset password logic
    console.log("Sending reset link to:", email);
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    console.log("Navigate back to login");
  };

  return (
    <AuthLayout layoutType={1}>
      <div className="text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <img src={ArrowIcon} alt="" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-4">
            Forgot your password?
          </h1>
          <p className="md:text-[18px] text-base md:leading-[24px] text-[#6B7280] font-normal max-w-[520px]">
            A reset link will be sent to the email provided below. Open your
            mailbox and follow the retrieval steps.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Email Field */}
          <div className="text-left">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
              placeholder="jonas@gmail.com"
              required
            />
          </div>

          {/* Reset Password Button */}
          <div className="">
            <CustomButton
              className="w-full"
              buttonText="Reset password"
              type="submit"
            />
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="inline-flex items-center text-[16px] font-medium text-[#6B7280] hover:text-[#1E1B4B] transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
