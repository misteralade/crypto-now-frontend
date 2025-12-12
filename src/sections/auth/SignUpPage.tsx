import CustomButton from "../../components/global/Button";
import AuthLayout from "../../layouts/AuthLayout";
import {Link} from "@tanstack/react-router";
import OtpSent from "./forgot-password/OtpSent.tsx";
import { useSignUpPage } from "../../hooks/pages/useSignUpPage.ts";
import {ROUTES} from "../../util/constants.util.ts";
import {Fragment} from "react";
import {
  CreateUserRequestSchema,
  type CreateUserRequestType
} from "../../schemas/user.schema.ts";
import {newUserInitialState } from "../../redux/states/user.states.ts";
import {Form, Formik} from "formik";
import {toFormikValidate} from "zod-formik-adapter";

export default function SignUpPage() {
 const {
   // Values
   otpSent,
   showPassword,
   
   // Functions
   handleSubmit,
   setShowPassword,
 } = useSignUpPage();
  
  return (
    <Fragment>
      {otpSent ? <OtpSent/> : <AuthLayout layoutType={2}>
        {/* Form Header */}
        <div className="mb-10">
          <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
            Create Account
          </h1>
          <p className="md:text-[18px] text-base md:leading-[24px] text-[#454745] font-normal">
            Sign up to enjoy the features of CryptoNow
          </p>
        </div>
        
        {/* Form */}
        <Formik<CreateUserRequestType>
          initialValues={newUserInitialState}
          validate={toFormikValidate(CreateUserRequestSchema)}
          onSubmit={(values) => handleSubmit(values)}
          validateOnBlur
          validateOnMount
        >
          {({ handleChange, handleBlur, errors, touched, values, isSubmitting, isValid }) => (
            <Form className="space-y-6">
              {/* First Name Field */}
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
                  placeholder="John"
                />
                
                {touched.firstName && errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              
              {/* Last Name Field */}
              <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
                  placeholder="Doe"
                />
                
                {touched.lastName && errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
              
              {/* Email Field */}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
                  placeholder="jonas@gmail.com"
                />
                
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                
                {/* Show Zod regex error (pattern mismatch) */}
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              
              {/* Sign Up Button */}
              <div className="pt-2">
                <CustomButton
                  type="submit"
                  className="w-full cursor-pointer"
                  buttonText={isSubmitting ? "Creating account..." : "Sign up"}
                  disabled={!isValid || isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
        
        {/* Disclaimer */}
        <div className="mt-4 p-4 bg-[#FFF7ED] border border-[#FED7AA] rounded-[12px]">
          <p className="text-[14px] leading-[20px] text-[#9A3412]">
            <strong className="font-semibold">Important:</strong> The name you use when opening your bank account must match the name on your bank account. Please ensure your first name and last name match exactly as they appear on your bank account documents.
          </p>
        </div>
        
        {/* Sign In Link */}
        <p className="text-center text-[14px] leading-[20px] text-[#6B7280] pt-2">
          Already have an account?{""}
          <Link
            to={ROUTES.SIGNIN}
            className="font-semibold text-[#1E1B4B] hover:text-[#2D2A5A] underline transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </AuthLayout>}
    </Fragment>
  
  );
}
